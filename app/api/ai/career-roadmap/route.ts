import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getStudentProfile, getUserRoadmap, saveUserRoadmap } from '@/lib/db/db-client';

const RoadmapSchema = z.object({
  summary: z.string(),
  prioritySkills: z.array(z.string()),
  learningRecommendations: z.array(z.object({ title: z.string(), skill: z.string(), duration: z.string() })),
  projectRecommendations: z.array(z.object({ title: z.string(), description: z.string() })),
  experienceRecommendations: z.array(z.object({ role: z.string(), company: z.string() })),
  nextSteps: z.array(z.string()),
});

export async function POST() {
  try {
    let userId = 'usr-authenticated-student-001';
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {}
    const { profile, skills } = await getStudentProfile(userId);
    const targetRole = profile.target_role || profile.career_goal || 'Software Engineer';
    const stream = profile.academic_stream || profile.course || 'Engineering & Technology';

    // 0. Check persistent roadmap cache to avoid unnecessary AI re-generation
    const cachedRecord = await getUserRoadmap(userId, targetRole);
    if (cachedRecord && cachedRecord.roadmap_data) {
      return NextResponse.json({
        success: true,
        source: 'PERSISTED_CACHE',
        data: cachedRecord.roadmap_data,
      });
    }

    const prompt = `Analyze this student profile and generate a structured 6-month career roadmap JSON:
Student Name: ${profile.full_name || 'Learner'}
Stream: ${stream}
Target Role: ${targetRole}
Readiness Score: ${profile.overall_readiness_score || 0}%
Skills: ${JSON.stringify(skills.map((s) => ({ name: s.skill_name, score: s.proficiency_score })))}

Return strictly valid JSON with keys: summary (string), prioritySkills (array of strings), learningRecommendations (array of {title, skill, duration}), projectRecommendations (array of {title, description}), experienceRecommendations (array of {role, company}), nextSteps (array of strings).`;

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
          const validated = RoadmapSchema.parse(parsed);

          // Save generated roadmap to DB cache
          await saveUserRoadmap(userId, targetRole, validated, modelName);

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

    // 2. Deterministic Grounded Recommendation Engine
    const topSkill = skills[0]?.skill_name || 'Core Competency';

    return NextResponse.json({
      success: true,
      source: 'DETERMINISTIC_ENGINE',
      data: {
        summary: `Based on your current readiness score (${profile.overall_readiness_score || 0}%), your primary focus should be strengthening key technical skills for ${targetRole} in ${stream}.`,
        prioritySkills: [topSkill, "Problem Solving", "Domain Analysis"],
        learningRecommendations: [
          { title: `Applied ${topSkill} Masterclass`, skill: topSkill, duration: "10 Hours" },
          { title: `${targetRole} Industry Foundations`, skill: "Domain Analysis", duration: "12 Hours" },
        ],
        projectRecommendations: [
          { title: `${topSkill} Portfolio Project`, description: `Build a practical demonstration project applying ${topSkill} skills.` },
        ],
        experienceRecommendations: [
          { role: `${targetRole} Intern`, company: "Verified Industry Partner" },
        ],
        nextSteps: [
          `Complete the ${topSkill} micro-course module.`,
          `Submit your portfolio project for mentor verification.`,
          `Apply for top-matched ${targetRole} positions.`,
        ],
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to generate career roadmap' },
      { status: 500 }
    );
  }
}

