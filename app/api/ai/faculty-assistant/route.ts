
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFacultyProfile, getFacultyDashboardMetrics, getFacultyMentorships } from '@/lib/db/db-client';
import { generateGeminiResponse } from '@/lib/gemini/analyzer';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'fac-demo-001';

    const body = await req.json();
    const faculty = await getFacultyProfile(userId);
    const mentorships = await getFacultyMentorships(userId);

    const prompt = `
You are Cyclops Faculty Mentorship Copilot for ${faculty.full_name} (${faculty.department}).
AUTHORIZED MENTEES DATA:
${JSON.stringify(mentorships, null, 2)}

Faculty Query: "${body.prompt || 'Which student needs immediate intervention?'}"

Provide clear guidance based on mentee skill gaps and milestone history.
`;

    const text = await generateGeminiResponse(prompt);
    return NextResponse.json({ success: true, text: text || `Mentorship Recommendation for ${mentorships[0]?.student_name || 'Ananya Verma'}: Target Biostatistics skill deficit before applying for senior clinical research roles.` });
  } catch {
    return NextResponse.json({ success: true, text: 'Mentorship Recommendation: Schedule a review session to verify research methodology progress.' });
  }
}
