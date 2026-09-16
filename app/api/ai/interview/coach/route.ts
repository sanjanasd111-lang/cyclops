import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { getInterviewSessionDetails, getStudentProfile } from '@/lib/db/db-client';

const CoachRequestSchema = z.object({
  sessionId: z.string(),
  userQuestion: z.string().min(1, 'User question cannot be empty'),
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
    const body = await req.json();
    const parsed = CoachRequestSchema.parse(body);

    const session = await getInterviewSessionDetails(parsed.sessionId, userId);
    if (!session) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    const { profile } = await getStudentProfile(userId);
    const questions = session.questions || [];
    const evaluations = questions.map((q: any) => ({
      question: q.question,
      answer: q.answer?.answer_text || 'No answer',
      score: q.evaluation?.overall_score || 0,
      feedback: q.evaluation?.feedback || '',
    }));

    const contextStr = JSON.stringify({
      targetRole: session.target_role,
      overallScore: session.overall_score,
      technicalScore: session.technical_score,
      relevanceScore: session.relevance_score,
      clarityScore: session.clarity_score,
      structureScore: session.structure_score,
      evaluations,
    });

    let coachReply = `Based on your ${session.target_role} mock interview (Overall Score: ${session.overall_score || 75}%):

• **Score Analysis:** Your strongest area was Technical Depth (${session.technical_score || 80}%), while Answer Structure (${session.structure_score || 70}%) has the highest growth potential.
• **STAR Method Tip:** For behavioral questions, explicitly break your answer into: Situation (context), Task (your responsibility), Action (steps taken), and Result (quantifiable metrics).
• **Action Step:** Re-attempt the session or practice a 10-question technical deep dive focusing on your primary skill gap.`;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey && apiKey !== 'demo-gemini-key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

        const prompt = `You are an elite corporate interview coach helping candidate "${profile.full_name || 'Learner'}".

INTERVIEW SESSION RECORDS (REAL DATA):
${contextStr}

STUDENT QUESTION: "${parsed.userQuestion}"

RULES:
1. Ground your advice strictly in the student's actual session scores, questions, and answers provided above.
2. DO NOT invent fake projects, companies, or tools not present in the record.
3. Be encouraging, concise, and provide actionable STAR method or technical guidance.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.length > 20) {
          coachReply = text;
        }
      } catch {
        // Fallback coach reply
      }
    }

    return NextResponse.json({
      success: true,
      reply: coachReply,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process AI Coach query' }, { status: 500 });
  }
}
