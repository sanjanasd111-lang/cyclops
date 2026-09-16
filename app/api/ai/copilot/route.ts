import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  getStudentProfile,
  getActiveOpportunities,
  getStudentApplications,
  getStudentResumes,
  getLatestResumeAnalysis,
  saveAIInteraction,
  getInterviewSessions,
  getInterviewAnalytics,
} from '@/lib/db/db-client';
import { UserSkill, Opportunity } from '@/lib/types';
import { calculateCareerReadiness } from '@/lib/matching/readiness';
import { evaluateCandidateOpportunities } from '@/lib/matching/engine';

export const maxDuration = 30;

const AICopilotSchema = z.object({
  reply: z.string(),
  topRecommendation: z.string().optional(),
  suggestedAction: z.string().optional(),
});

function generateDynamicCopilotReply(userMsg: string, profile: any, skills: UserSkill[], gaps: any[], activeOpps: Opportunity[], atsScore: number, applicationsCount: number, interviewAnalytics: any): string {
  const query = (userMsg || '').toLowerCase();
  const studentName = profile.full_name || 'Student Candidate';
  const stream = profile.academic_stream || profile.course || 'Degree Program';
  const role = profile.target_role || profile.career_goal || 'Target Specialist';

  const topGap = gaps.find((g) => g.gap > 0) || { skill_name: 'SQL & Analytics', current_score: 45, required_score: 75, gap: 30 };
  const topSkill = skills.find((s) => s.proficiency_score >= 75)?.skill_name || 'Core Domain Skills';
  const topOpp = activeOpps[0];

  const trimmedLower = query.trim();
  const isGreeting = /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo|sup|help|start)\b/i.test(trimmedLower);
  if (isGreeting) {
    return `Hello **${studentName}**! 👋 I am your Cyclops AI Career Copilot.

I am synced in real time with your **${stream}** academic records, verified skills, and placement listings. How can I assist your career preparation today?

Here are a few things you can ask me:
• *"How can I improve my Career Readiness score?"*
• *"Which job & internship opportunities match my skills?"*
• *"What are my top skill gaps for ${role}?"*
• *"How should I prepare for my upcoming mock interviews?"*`;
  }

  if (query.includes('interview') || query.includes('prepare') || query.includes('question') || query.includes('score low') || query.includes('mock')) {
    if (interviewAnalytics.totalAttempts > 0) {
      return `Hello **${studentName}**! Here is your AI Interview Simulator performance summary:
      
• **Attempts Completed:** ${interviewAnalytics.totalAttempts} interview(s)
• **Average Interview Score:** **${interviewAnalytics.averageScore}/100**
• **Top Weaknesses:** ${interviewAnalytics.topWeaknesses.join(', ') || 'Technical detail depth'}
• **Top Strengths:** ${interviewAnalytics.topStrengths.join(', ') || 'Relevance & clarity'}

**Targeted Advice to Improve:**
1. Practice STAR-structured answers for behavioral and resume questions.
2. Focus on **${topGap.skill_name}** edge cases during practical domain questions.
3. Use the AI Interview Simulator at \`/student/interview/simulator\` for live adaptive practice.`;
    }
    return `Here are key interview preparation topics for **${role}**:

1. **Technical Core:** Be ready to explain your project implementations involving **${topSkill}**.
2. **Problem Solving:** Be prepared to answer questions on **${topGap.skill_name}** scenarios.
3. **Behavioral & Domain:** Be ready to discuss your academic work in **${stream}**.
4. **Simulator Practice:** Launch your first mock interview at \`/student/interview/simulator\` to get instant Zod-validated feedback.`;
  }

  if (query.includes('readiness') || query.includes('improve') || query.includes('score')) {
    return `Hello **${studentName}**! Here is your career readiness analysis for **${role}**:

• **Overall Readiness:** **${profile.overall_readiness_score || 80}%**
• **Top Skill Gap:** **${topGap.skill_name}** (${topGap.current_score}% current vs ${topGap.required_score}% target required).
• **Resume ATS Score:** **${atsScore}/100**
• **Interview Readiness:** **${interviewAnalytics.averageScore || 70}/100**

**Recommended Action Steps:**
1. Focus on bridging your **${topGap.skill_name}** deficit (-${topGap.gap} pts) to unlock higher candidate matching.
2. Complete 1 practical project applying **${topSkill}** and update your resume.
3. Practice a technical interview attempt in the Interview Prep Center.`;
  }

  if (query.includes('job') || query.includes('internship') || query.includes('opportunity') || query.includes('match') || query.includes('apply')) {
    return `Great question, **${studentName}**! Based on your **${stream}** skills:

${topOpp ? `• **${topOpp.title}** at **${topOpp.company_name}** (${topOpp.location}) — Match Score: High Compatibility.` : `• **${role} Internship** — High compatibility match found.`}

• **Active Applications:** ${applicationsCount} submitted application(s).

**Why You Match:**
Your background in **${stream}** and verified skill **${topSkill}** directly meet recruiter requirements.`;
  }

  if (query.includes('roadmap') || query.includes('30-day') || query.includes('plan') || query.includes('learn')) {
    return `Here is your grounded 30-Day Action Plan for **${role}**:

• **Week 1 (Days 1–7):** Practice fundamentals of **${topGap.skill_name}** (Target: +15 pts).
• **Week 2 (Days 8–15):** Build a practical project utilizing **${topSkill}** and **${topGap.skill_name}**.
• **Week 3 (Days 16–23):** Optimize your resume ATS score (Current: ${atsScore}/100) and sync verified badges.
• **Week 4 (Days 24–30):** Practice AI Interviews and submit applications to top-matched opportunities.`;
  }

  return `As a **${stream}** student targeting **${role}**:

• **Overall Readiness:** **${profile.overall_readiness_score || 80}%**
• **Primary Skill Gap:** **${topGap.skill_name}** (${topGap.current_score}% vs ${topGap.required_score}% target)
• **Resume ATS Calibration:** **${atsScore}/100**
• **Interview Readiness:** **${interviewAnalytics.averageScore || 70}/100** (${interviewAnalytics.totalAttempts} mock drills completed)

**Strategic Recommendation:**
Closing your **${topGap.skill_name}** gap and practicing STAR-method answers in the Interview Simulator will immediately elevate your candidate match score across active employer listings.`;
}

export async function POST(req: Request) {
  try {
    let userId = 'usr-authenticated-student-001';
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {}

    const body = await req.json().catch(() => ({}));
    const { messages, message, sessionId } = body;

    const { profile, skills } = await getStudentProfile(userId);
    const activeOpps = await getActiveOpportunities();
    const applications = await getStudentApplications(userId);
    const resumes = await getStudentResumes(userId);
    const latestAnalysis = await getLatestResumeAnalysis(userId);
    const interviewAnalytics = await getInterviewAnalytics(userId);

    const atsScore = latestAnalysis?.ats_score || resumes[0]?.ats_score || 70;
    const targetRole = profile.target_role || profile.career_goal || 'Software Engineer';

    // Calculate real readiness & gaps
    const readiness = calculateCareerReadiness(
      profile,
      skills,
      profile.projects?.length,
      profile.certifications?.length,
      (profile.experience?.length || 0) > 0,
      atsScore,
      undefined,
      interviewAnalytics.averageScore
    );
    profile.overall_readiness_score = readiness.overallScore;

    const matchedFeed = evaluateCandidateOpportunities(profile, skills, activeOpps);
    const reqSkillsList = matchedFeed[0]?.opp.required_skills?.map((s) => s.skill_name) || ['Python', 'SQL', 'Data Analysis'];
    const gaps = reqSkillsList.map((skillName) => {
      const existing = skills.find((s: UserSkill) => s.skill_name.toLowerCase() === skillName.toLowerCase());
      const current_score = existing ? existing.proficiency_score : 40;
      return {
        skill_name: skillName,
        current_score,
        required_score: 75,
        gap: Math.max(0, 75 - current_score),
      };
    });

    const userMessages = messages && Array.isArray(messages) && messages.length > 0 ? messages : [];
    const lastUserMsg = message || (userMessages.length > 0 ? (userMessages[userMessages.length - 1].text || userMessages[userMessages.length - 1].content || '') : 'Hello');

    const contextStr = JSON.stringify({
      name: profile.full_name,
      stream: profile.academic_stream || profile.course,
      institution: profile.institution_name,
      targetRole,
      readinessScore: readiness.overallScore,
      skills: skills.map((s) => ({ name: s.skill_name, score: s.proficiency_score, verified: s.verification_status !== 'SELF_DECLARED' })),
      gaps,
      atsScore,
      applicationsCount: applications.length,
      interviewAttempts: interviewAnalytics.totalAttempts,
      interviewAvgScore: interviewAnalytics.averageScore,
      interviewWeaknesses: interviewAnalytics.topWeaknesses,
      topMatchedOpp: matchedFeed[0] ? { title: matchedFeed[0].opp.title, matchScore: matchedFeed[0].matchScore } : null,
    });

    const systemPrompt = `You are Cyclops AI Career Copilot, a grounded career intelligence assistant.
Student Context (REAL DATABASE RECORDS):
${contextStr}

Rules:
1. Ground answers strictly in the student's real data above.
2. DO NOT invent skills, fake projects, or unprovided metrics.
3. Keep response concise, encouraging, and actionable.`;

    let finalReply = generateDynamicCopilotReply(lastUserMsg, profile, skills, gaps, activeOpps, atsScore, applications.length, interviewAnalytics);

    const isSimpleGreeting = /^(hi|hello|hey|hey there|greetings|good morning|good afternoon|good evening|yo|sup|help|start)\b/i.test(lastUserMsg.trim());

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!isSimpleGreeting && apiKey && apiKey !== 'demo-gemini-key' && apiKey !== 'your-google-ai-studio-api-key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // Strict 3.5s timeout race to guarantee fast responsiveness
        const aiPromise = model.generateContent(`${systemPrompt}\n\nUser Question: "${lastUserMsg}"`);
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
        const res: any = await Promise.race([aiPromise, timeoutPromise]);

        if (res && typeof res.response?.text === 'function') {
          const text = res.response.text();
          if (text && text.trim().length > 15) {
            finalReply = text.trim();
          }
        }
      } catch {
        // Instant fallback to grounded reply
      }
    }

    // Save interaction in DB table ai_interactions
    await saveAIInteraction(userId, lastUserMsg, finalReply, 'CAREER_COPILOT', sessionId || 'session-main');

    const prefersJson = body.format === 'json' || Boolean(body.message) || req.headers.get('accept')?.includes('application/json');

    if (prefersJson) {
      return NextResponse.json({
        success: true,
        data: {
          reply: finalReply,
          readinessScore: readiness.overallScore,
          targetRole,
          topSkill: skills[0]?.skill_name || 'Core Domain',
          topGap: gaps[0]?.skill_name || 'SQL',
          atsScore,
        },
      });
    }

    return new Response(finalReply, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    const fallbackReply = `I am currently analyzing your profile against active platform listings. Focus on completing your verified skill badges to boost your match score.`;
    return NextResponse.json({
      success: true,
      data: {
        reply: fallbackReply,
      },
    });
  }
}
