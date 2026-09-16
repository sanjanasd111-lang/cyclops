import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentProfile, getOpportunities, getProfileVisibility } from '@/lib/db/db-client';
import { matchStudentToOpportunity } from '@/lib/matching/engine';
import { INITIAL_STUDENT_PROFILE, INITIAL_USER_SKILLS } from '@/lib/db/seed-data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;
    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get('opportunityId') || 'opp-dabur-01';

    // Retrieve candidate profile and skills
    let { profile, skills } = await getStudentProfile(candidateId);
    if (!profile || !profile.full_name) {
      profile = INITIAL_STUDENT_PROFILE;
      skills = INITIAL_USER_SKILLS;
    }

    const visibility = await getProfileVisibility(candidateId);

    // Retrieve target opportunity for match calculation
    const opps = await getOpportunities();
    const targetOpp = opps.find((o) => o.id === opportunityId) || opps[0];

    const matchBreakdown = matchStudentToOpportunity(profile, skills, targetOpp);

    // Respect privacy controls
    const sanitizedCandidate = {
      id: candidateId,
      name: profile.full_name,
      degree: profile.degree || profile.course,
      institution: profile.institution_name || 'MS Ramaiah University of Applied Sciences',
      stream: profile.academic_stream || 'Engineering & Technology',
      department: profile.department || 'Computer Science & Engineering',
      year: profile.year,
      readinessScore: profile.overall_readiness_score || 78,
      targetRole: profile.target_role || profile.career_goal,
      matchScore: matchBreakdown.overallScore,
      matchBreakdown,
      skills: visibility.skills_visible ? skills : [],
      projects: visibility.projects_visible ? (profile.projects || [
        { title: 'Cloud Infrastructure & API Gateway', desc: 'Scalable Node.js microservices with Redis caching.' }
      ]) : [],
      certifications: profile.certifications || [
        { name: 'Certified Cloud Practitioner', issuer: 'AWS Training', year: 2025 }
      ],
      experience: profile.experience || [],
      resumeUrl: visibility.resume_visible ? profile.resume_url : undefined,
      contactVisible: visibility.contact_visible,
    };

    return NextResponse.json({
      success: true,
      data: sanitizedCandidate,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch candidate details' },
      { status: 500 }
    );
  }
}
