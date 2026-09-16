import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getStudentProfile, getActiveOpportunities, saveResumeAnalysis } from '@/lib/db/db-client';
import { calculateDeterministicATSScore } from '@/lib/resume/ats-engine';
import { ResumeContentData } from '@/lib/types/resume-types';

const AIQualitativeFeedbackSchema = z.object({
  qualitativeSummary: z.string(),
  topStrengths: z.array(z.string()),
  criticalWeaknesses: z.array(z.string()),
  sectionFeedback: z.record(z.string(), z.string()),
  actionableRecommendations: z.array(
    z.object({
      title: z.string(),
      why: z.string(),
      howToImprove: z.string(),
      suggestedWording: z.string().optional(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const body = await req.json();
    const { resumeContent, rawText, targetRole, opportunityId, resumeId } = body;

    const { profile, skills } = await getStudentProfile(userId);
    const opportunities = await getActiveOpportunities();
    const selectedOpp = opportunities.find((o) => o.id === opportunityId);

    const effectiveTargetRole = targetRole || selectedOpp?.title || profile.target_role || profile.career_goal || 'Software Engineer';

    // 1. Calculate DETERMINISTIC ATS Score (Numerical Rubric)
    const atsResult = calculateDeterministicATSScore(
      resumeContent || rawText || '',
      profile,
      skills,
      effectiveTargetRole,
      selectedOpp
    );

    // 2. Call Gemini AI Studio for Qualitative Recommendations
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    let aiQualitativeData: z.infer<typeof AIQualitativeFeedbackSchema> = {
      qualitativeSummary: `Your resume shows ${atsResult.scoreTier} alignment (${atsResult.atsScore}/100) for ${effectiveTargetRole}. Focus on adding target keywords and action verbs.`,
      topStrengths: atsResult.strengths,
      criticalWeaknesses: atsResult.weaknesses,
      sectionFeedback: {
        Summary: 'Ensure summary clearly states your degree, top skills, and target role.',
        Projects: 'Use Action + Technology + Problem + Impact bullet structure.',
      },
      actionableRecommendations: atsResult.recommendations.map((r) => ({
        title: r.title,
        why: r.why,
        howToImprove: r.howToImprove,
        suggestedWording: r.suggestedWording,
      })),
    };

    const resumeStr = typeof resumeContent === 'string'
      ? resumeContent
      : resumeContent
      ? JSON.stringify(resumeContent)
      : rawText || 'Student profile and projects resume';

    if (apiKey && apiKey !== 'demo-gemini-key') {
      const prompt = `Perform qualitative ATS resume coaching for a student:
Target Role: ${effectiveTargetRole}
Student Academic Stream: ${profile.academic_stream || profile.course || 'Degree Program'}
Calculated ATS Score: ${atsResult.atsScore}/100 (${atsResult.scoreTier})
Matched Keywords: ${JSON.stringify(atsResult.matchedKeywords)}
Missing Keywords: ${JSON.stringify(atsResult.missingKeywords)}
Missing Verified Skills: ${JSON.stringify(atsResult.verifiedSkillsMissingFromResume)}
Raw Resume Sample: "${resumeStr.slice(0, 1500)}"

Instructions:
1. Provide qualitative insights. DO NOT change the calculated numerical score.
2. DO NOT invent false work achievements or fake metrics.
3. Return strictly valid JSON with keys:
qualitativeSummary (string), topStrengths (array of strings), criticalWeaknesses (array of strings), sectionFeedback (object mapping section name to feedback string), actionableRecommendations (array of {title, why, howToImprove, suggestedWording}).`;

      for (const modelName of ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro']) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent(prompt);
          const cleaned = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          const validated = AIQualitativeFeedbackSchema.parse(parsed);

          aiQualitativeData = {
            qualitativeSummary: validated.qualitativeSummary,
            topStrengths: validated.topStrengths.length > 0 ? validated.topStrengths : atsResult.strengths,
            criticalWeaknesses: validated.criticalWeaknesses.length > 0 ? validated.criticalWeaknesses : atsResult.weaknesses,
            sectionFeedback: validated.sectionFeedback,
            actionableRecommendations: validated.actionableRecommendations,
          };
          break;
        } catch {
          // Try next model
        }
      }
    }

    // Combine Deterministic Score + Qualitative Advice
    const finalResult = {
      ...atsResult,
      strengths: aiQualitativeData.topStrengths,
      weaknesses: aiQualitativeData.criticalWeaknesses,
      recommendations: aiQualitativeData.actionableRecommendations.map((r, idx) => ({
        id: `rec-${idx + 1}`,
        type: (idx === 0 ? 'CRITICAL' : 'WARNING') as 'SUCCESS' | 'WARNING' | 'CRITICAL',
        title: r.title,
        description: r.why,
        why: r.why,
        howToImprove: r.howToImprove,
        suggestedWording: r.suggestedWording,
      })),
      sectionFeedback: Object.entries(aiQualitativeData.sectionFeedback).reduce<
        Record<string, { status: 'COMPLETE' | 'NEEDS_WORK' | 'MISSING'; feedback: string }>
      >((acc, [key, val]) => {
        acc[key] = { status: 'NEEDS_WORK', feedback: val };
        return acc;
      }, { ...atsResult.sectionFeedback }),
    };

    // Save to Database
    await saveResumeAnalysis(userId, {
      resume_id: resumeId,
      target_role: effectiveTargetRole,
      opportunity_id: opportunityId,
      ats_score: finalResult.atsScore,
      keyword_score: finalResult.keywordScore,
      skill_alignment: finalResult.skillAlignment,
      format_score: finalResult.formatScore,
      section_completeness: finalResult.sectionCompleteness,
      impact_score: finalResult.impactScore,
      readability_score: finalResult.readabilityScore,
      matched_keywords: finalResult.matchedKeywords,
      missing_keywords: finalResult.missingKeywords,
      missing_skills: finalResult.missingSkills,
      recommendations: finalResult.recommendations,
      section_feedback: finalResult.sectionFeedback,
    });

    return NextResponse.json({
      success: true,
      data: finalResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to complete resume analysis' },
      { status: 500 }
    );
  }
}
