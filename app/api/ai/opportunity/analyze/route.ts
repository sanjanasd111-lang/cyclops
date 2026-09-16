import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getStudentProfile, getOpportunityById, getStudentResumes } from '@/lib/db/db-client';
import { evaluateCandidateOpportunities } from '@/lib/matching/engine';

const AIOpportunityAnalysisSchema = z.object({
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  educationRequirements: z.string(),
  experienceRequirements: z.string(),
  resumeKeywordGaps: z.array(z.string()),
  skillGaps: z.array(z.string()),
  applicationAdvice: z.string(),
  interviewTopics: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const body = await req.json().catch(() => ({}));
    const { opportunityId } = body;

    const { profile, skills } = await getStudentProfile(userId);
    const opp = await getOpportunityById(opportunityId);
    const resumes = await getStudentResumes(userId);

    if (!opp) {
      return NextResponse.json({ success: false, error: 'Opportunity not found' }, { status: 404 });
    }

    // Compute deterministic match score using 7-tier matching engine
    const matchEvaluations = evaluateCandidateOpportunities(profile, skills, [opp]);
    const matchResult = matchEvaluations[0];

    const studentSkillsLower = skills.map((s) => s.skill_name.toLowerCase());
    const reqSkillsNames = (opp.required_skills || []).map((s) => s.skill_name);
    const prefSkillsNames = (opp.preferred_skills || []).map((s) => s.skill_name);

    const missingSkills = reqSkillsNames.filter((s) => !studentSkillsLower.some((ss) => ss.includes(s.toLowerCase()) || s.toLowerCase().includes(ss)));
    const matchedSkills = reqSkillsNames.filter((s) => studentSkillsLower.some((ss) => ss.includes(s.toLowerCase()) || s.toLowerCase().includes(ss)));

    const studentName = profile.full_name || 'Candidate';
    const streamName = profile.academic_stream || profile.course || 'Degree Program';
    const matchedText = matchedSkills.length > 0 ? matchedSkills.join(', ') : `foundational coursework in ${streamName}`;
    const gapsAdvice = missingSkills.length > 0
      ? `To be competitive for this ${opp.opportunity_type.toLowerCase()} role at ${opp.company_name}, build and feature 1-2 practical projects incorporating ${missingSkills.slice(0, 2).join(' and ')} alongside your existing competencies (${matchedText}). Ensure ${missingSkills.join(', ')} keywords are explicitly represented on your resume.`
      : `Your verified profile covers 100% of the core required competencies for this position. Focus on presenting end-to-end project architecture and measurable impact in your submission.`;

    let defaultAnalysis = {
      requiredSkills: reqSkillsNames,
      preferredSkills: prefSkillsNames.length > 0 ? prefSkillsNames : ['Problem Solving', 'Domain Adaptability'],
      educationRequirements: opp.eligibility || 'Degree Candidate',
      experienceRequirements: opp.experience_level || 'Entry Level / Intern',
      resumeKeywordGaps: missingSkills,
      skillGaps: missingSkills,
      applicationAdvice: `Your background in ${streamName} with verified competencies in ${matchedText} provides a strong foundation for ${opp.company_name}'s ${opp.title}. ${gapsAdvice}`,
      interviewTopics: [
        `Core Technical Competency: Deep-dive into ${matchedSkills[0] || reqSkillsNames[0] || 'domain fundamentals'}`,
        missingSkills.length > 0 ? `Target Skill Assessment: Technical problem solving using ${missingSkills[0]}` : `System Reliability: Scaling and operational excellence in ${opp.title}`,
        `Portfolio Walkthrough: Architecture and deliverables from ${profile.projects?.[0]?.title || 'your key demonstration projects'}`,
        `Domain Integration: Aligning ${streamName} principles with ${opp.company_name}'s requirements`,
        `Professional Collaboration: Engineering practices, testing, and team workflows`,
      ],
    };

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey && apiKey !== 'demo-gemini-key') {
      const prompt = `Analyze this opportunity against the candidate's actual profile:
Opportunity: ${opp.title} at ${opp.company_name}
Required Skills: ${JSON.stringify(reqSkillsNames)}
Eligibility: ${opp.eligibility}
Candidate Name: ${studentName}
Candidate Academic Stream: ${streamName}
Candidate Target Role: ${profile.target_role || profile.career_goal || 'Candidate'}
Candidate Verified Skills: ${JSON.stringify(skills.map((s) => s.skill_name))}
Candidate Matched Skills for this role: ${JSON.stringify(matchedSkills)}
Candidate Missing Skills for this role: ${JSON.stringify(missingSkills)}
Candidate Projects: ${JSON.stringify(profile.projects?.map((p) => p.title) || [])}

Instructions:
1. Under applicationAdvice ("Why You Fit"), directly explain how the candidate's actual background (${streamName}, their verified skills [${matchedSkills.join(', ')}], and projects) fits ${opp.company_name}'s role for ${opp.title}. Explicitly advise what specific missing skills (${missingSkills.join(', ') || 'specialized tools'}) they should highlight or practice.
2. Under interviewTopics, provide 4-5 concrete interview questions or technical topics specific to this role and the candidate's skill gaps.
3. Return strictly valid JSON with keys: requiredSkills (array), preferredSkills (array), educationRequirements (string), experienceRequirements (string), resumeKeywordGaps (array), skillGaps (array), applicationAdvice (string), interviewTopics (array).`;

      for (const modelName of ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash']) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent(prompt);
          const cleaned = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          const validated = AIOpportunityAnalysisSchema.parse(parsed);

          defaultAnalysis = validated;
          break;
        } catch {
          // Fallback to grounded default
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        opportunity: opp,
        matchResult,
        analysis: defaultAnalysis,
        resumes,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze opportunity' },
      { status: 500 }
    );
  }
}
