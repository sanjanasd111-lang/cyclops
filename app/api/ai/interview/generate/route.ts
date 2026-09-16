import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import {
  getStudentProfile,
  getOpportunityById,
  getStudentResumes,
  getResumeById,
  createInterviewSession,
  saveInterviewQuestions,
  saveQuestionHistoryRecord,
  getUserQuestionHistoryHashes,
} from '@/lib/db/db-client';
import { createQuestionBlueprint } from '@/lib/interview/blueprint-engine';
import { filterDomainValidQuestions, isQuestionDomainValid } from '@/lib/interview/domain-validator';
import { isQuestionDuplicate, recordUserQuestionHash, computeQuestionHash } from '@/lib/interview/question-history';

const GenerateSchema = z.object({
  targetRole: z.string().optional(),
  opportunityId: z.string().optional(),
  resumeId: z.string().optional(),
  interviewType: z.enum(['TECHNICAL', 'HR', 'BEHAVIORAL', 'ROLE_SPECIFIC', 'RESUME_BASED', 'MIXED']).default('MIXED'),
  questionCount: z.number().min(1).max(30).default(10),
});

async function getUserId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;
  } catch {}
  return 'usr-authenticated-student-001';
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json().catch(() => ({}));
    const parsed = GenerateSchema.parse(body);

    const { profile, skills } = await getStudentProfile(userId);
    const targetRole = parsed.targetRole || profile.target_role || profile.career_goal || 'Software Engineer';
    const academicBranch = profile.academic_stream || profile.department || profile.course || 'Computer Science / Engineering';

    // Fetch opportunity details if provided
    let oppDetails: any = null;
    if (parsed.opportunityId) {
      oppDetails = await getOpportunityById(parsed.opportunityId);
    }

    // Fetch resume details if provided
    let resumeContent: any = null;
    if (parsed.resumeId) {
      resumeContent = await getResumeById(parsed.resumeId, userId);
    } else {
      const resumes = await getStudentResumes(userId);
      if (resumes && resumes.length > 0) {
        resumeContent = resumes[0];
      }
    }

    // Create deterministic question blueprint
    const blueprint = createQuestionBlueprint({
      userId,
      profile,
      skills,
      targetRole,
      interviewType: parsed.interviewType,
      questionCount: parsed.questionCount,
      opportunityDetails: oppDetails,
      resumeContent,
    });

    // Fetch user's previous question history hashes to prevent duplicates
    const previousHashes = await getUserQuestionHistoryHashes(userId);

    // Grounded data payload strings
    const verifiedSkillsList = skills.map((s) => `${s.skill_name} (${s.proficiency_score}%, ${s.verification_status})`).join(', ');
    const skillGapsList = blueprint.skillGaps.map((sg) => `${sg.skill} (Current: ${sg.current}%, Target: ${sg.required}%)`).join(', ');
    const projectsList = (profile.projects || []).map((p) => `${p.title}: ${p.description}`).join(' | ');
    const certsList = (profile.certifications || []).map((c) => `${c.name} (${c.issuer})`).join(' | ');
    const expList = (profile.experience || []).map((e) => `${e.title} at ${e.organization}: ${e.description}`).join(' | ');

    const apiKey = process.env.GEMINI_API_KEY || '';
    let aiQuestions: any[] = [];

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const prompt = `You are an expert corporate technical interviewer and talent assessor.
Generate exactly ${parsed.questionCount} interview questions specifically tailored for a candidate.

CANDIDATE GROUNDED PROFILE:
- Academic Branch: ${academicBranch}
- Specialization / Degree: ${profile.specialization || profile.degree || 'General'}
- Target Role: ${targetRole}
- Career Goal: ${profile.career_goal || targetRole}
- Verified Skills: ${verifiedSkillsList || 'Core domain competencies'}
- Priority Skill Gaps to Assess: ${skillGapsList || 'None specified'}
- Key Projects: ${projectsList || 'None specified'}
- Experience: ${expList || 'None specified'}
- Certifications: ${certsList || 'None specified'}
${oppDetails ? `- Selected Target Opportunity: "${oppDetails.title}" at "${oppDetails.company_name}". Required Skills: ${oppDetails.required_skills?.join(', ')}.` : ''}
${resumeContent ? `- Resume Content Summary: ${resumeContent.summary || ''}, Projects: ${JSON.stringify(resumeContent.projects || [])}, Experience: ${JSON.stringify(resumeContent.experience || [])}.` : ''}

QUESTION DISTRIBUTION BLUEPRINT:
- Technical Questions: ${blueprint.distribution.technical}
- Role-Specific Questions: ${blueprint.distribution.roleSpecific}
- Skill-Gap Focused Questions: ${blueprint.distribution.skillGapFocused}
- Resume-Based Questions: ${blueprint.distribution.resumeBased}
- Behavioral Questions: ${blueprint.distribution.behavioral}
- HR / Career Questions: ${blueprint.distribution.hr}

STRICT DOMAIN RELEVANCE RULES:
1. Ground questions STRICTLY in the candidate's actual academic branch ("${academicBranch}"), target role ("${targetRole}"), verified skills, and identified skill gaps.
2. DO NOT assume or inject medical, Ayurveda, healthcare, clinical research, or pharmacology terms UNLESS the candidate's academic branch or target role explicitly requires them.
3. If the candidate is in Computer Science, Mechanical Engineering, Business, Finance, Law, or Arts, ask domain questions corresponding strictly to their branch.
4. Ensure each question tests a specific skill or competency relevant to ${targetRole}.

Output JSON ONLY with schema:
{
  "questions": [
    {
      "category": "TECHNICAL" | "BEHAVIORAL" | "HR" | "ROLE_SPECIFIC" | "RESUME" | "PROBLEM_SOLVING",
      "difficulty": "EASY" | "MEDIUM" | "HARD",
      "question": "Clear realistic question string",
      "expected_topics": ["Topic1", "Topic2"]
    }
  ]
}`;

      const modelNames = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          });
          const responseText = result.response.text();
          const jsonRes = JSON.parse(responseText);
          if (jsonRes.questions && Array.isArray(jsonRes.questions)) {
            // Filter by Domain Validator and Duplicate Prevention
            const valid = filterDomainValidQuestions({
              questions: jsonRes.questions,
              academicBranch,
              targetRole,
              studentSkills: skills.map((s) => s.skill_name),
            });

            const nonDuplicates = valid.filter((q) => {
              const text = q.question || '';
              return !isQuestionDuplicate(userId, text, previousHashes);
            });

            if (nonDuplicates.length > 0) {
              aiQuestions = nonDuplicates;
              break;
            }
          }
        } catch {
          // Fallback to next model or deterministic generator
        }
      }
    }

    // Branch-Aware Deterministic Fallback Generator if AI unavailable or empty
    if (aiQuestions.length < parsed.questionCount) {
      const studentSkillNames = skills.map((s) => s.skill_name);
      const primarySkill = studentSkillNames[0] || 'Core Domain Concepts';
      const secondarySkill = studentSkillNames[1] || 'Problem Solving';
      const gapSkill = blueprint.skillGaps[0]?.skill || primarySkill;
      const project = profile.projects?.[0]?.title || 'your recent practical project';

      const fallbackTemplates = [
        {
          category: 'TECHNICAL',
          difficulty: 'MEDIUM',
          question: `Explain how you apply core principles of ${primarySkill} when solving complex technical problems in ${academicBranch}.`,
          expected_topics: [primarySkill],
        },
        {
          category: 'ROLE_SPECIFIC',
          difficulty: 'HARD',
          question: `As a ${targetRole}, how do you evaluate system performance and design robust solutions under tight deadlines?`,
          expected_topics: [targetRole, 'System Design'],
        },
        {
          category: 'TECHNICAL',
          difficulty: 'MEDIUM',
          question: `Let's focus on your skill gap in ${gapSkill}: walk me through your step-by-step methodology to implement and test solutions in ${gapSkill}.`,
          expected_topics: [gapSkill, 'Skill Gap'],
        },
        {
          category: 'RESUME',
          difficulty: 'MEDIUM',
          question: `Walk me through the technical implementation of "${project}". What key engineering or analytical trade-offs did you make?`,
          expected_topics: [project, primarySkill],
        },
        {
          category: 'BEHAVIORAL',
          difficulty: 'EASY',
          question: `Describe a situation where you encountered an unexpected technical obstacle during a ${secondarySkill} project. How did you resolve it?`,
          expected_topics: ['STAR Method', secondarySkill],
        },
        {
          category: 'HR',
          difficulty: 'EASY',
          question: `Why are you interested in pursuing a career as a ${targetRole} in the ${academicBranch} field, and how do your verified skills align with this goal?`,
          expected_topics: ['Career Goal', targetRole],
        },
      ];

      for (let i = aiQuestions.length; i < parsed.questionCount; i++) {
        const tmpl = fallbackTemplates[i % fallbackTemplates.length];
        if (
          isQuestionDomainValid({
            questionText: tmpl.question,
            academicBranch,
            targetRole,
            studentSkills: studentSkillNames,
          }) &&
          !isQuestionDuplicate(userId, tmpl.question, previousHashes)
        ) {
          aiQuestions.push(tmpl);
        }
      }
    }

    // Slice to exact requested count
    aiQuestions = aiQuestions.slice(0, parsed.questionCount);

    // Save session in DB
    const session = await createInterviewSession(
      userId,
      targetRole,
      parsed.opportunityId,
      parsed.resumeId,
      parsed.interviewType,
      parsed.questionCount
    );

    // Save questions in DB & record in question history
    const savedQuestions = await saveInterviewQuestions(session.id, aiQuestions);

    for (const sq of savedQuestions) {
      const qText = sq.question || '';
      const hash = recordUserQuestionHash(userId, qText);
      await saveQuestionHistoryRecord(userId, hash, qText, session.id);
    }

    return NextResponse.json({
      success: true,
      session: {
        ...session,
        blueprint,
        questions: savedQuestions.map((q) => ({
          id: q.id,
          question_number: q.question_number,
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          is_adaptive_followup: q.is_adaptive_followup,
        })),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate personalized interview session' }, { status: 500 });
  }
}
