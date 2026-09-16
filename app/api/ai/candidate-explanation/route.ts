import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getActiveOpportunities, getStudentProfile } from '@/lib/db/db-client';
import { matchStudentToOpportunity } from '@/lib/matching/engine';

const ExplanationSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendation: z.string(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const body = await request.json();
    const { opportunity_id, student_id } = body;
    const targetStudentId = student_id || userId;

    const opportunities = await getActiveOpportunities();
    const opportunity = opportunities.find((o) => o.id === opportunity_id) || opportunities[0];
    const { profile, skills } = await getStudentProfile(targetStudentId);
    const matchBreakdown = matchStudentToOpportunity(profile, skills, opportunity);
    const candidateName = profile.full_name || 'Candidate';

    const prompt = `Provide an explainable match rationale for candidate ${candidateName} (${profile.academic_stream || profile.course || 'Degree Holder'}) applying to ${opportunity.title} at ${opportunity.company_name}.
Match Score: ${matchBreakdown.overallScore}%
Breakdown: ${JSON.stringify(matchBreakdown)}

Return strictly JSON with keys: summary (string), strengths (array of strings), gaps (array of strings), recommendation (string).`;

    // 1. Google Gemini AI Studio Engine
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey && apiKey !== 'your-gemini-api-key-here' && apiKey !== 'demo-gemini-key') {
      for (const modelName of ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro']) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          const validated = ExplanationSchema.parse(parsed);

          return NextResponse.json({
            success: true,
            source: 'GEMINI_AI',
            data: validated,
          });
        } catch {
          // Try next model
        }
      }
    }

    // 2. Deterministic Grounded Fallback
    const topStrength = matchBreakdown.matchedSkills[0]?.skillName || skills[0]?.skill_name || 'Core Skills';
    const topGap = matchBreakdown.missingSkills[0]?.skillName || 'Biostatistics';

    return NextResponse.json({
      success: true,
      source: 'DETERMINISTIC_EXPLANATION',
      data: {
        summary: `${candidateName} is a ${matchBreakdown.overallScore}% match for the ${opportunity.title} position at ${opportunity.company_name}. Demonstrates proficiency in ${topStrength}.`,
        strengths: [
          `Solid competency in ${topStrength}.`,
          `Academic alignment under ${profile.academic_stream || profile.course || 'Degree Program'}.`,
          `Overall skill readiness score of ${profile.overall_readiness_score || 75}%.`,
        ],
        gaps: [
          `Developing area in ${topGap}.`,
        ],
        recommendation: matchBreakdown.overallScore >= 70 ? 'Recommended for Interview.' : 'Consider for interview with skill bridge training.',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

