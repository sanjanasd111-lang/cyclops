import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getStudentResumes,
  getResumeById,
  saveStudentResume,
  deleteStudentResume,
  saveResumeVersion,
  getResumeVersions,
  getLatestResumeAnalysis
} from '@/lib/db/db-client';

export async function GET(req: NextRequest) {
  try {
    let userId = 'usr-authenticated-student-001';
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {}

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('id');

    if (resumeId) {
      const resume = await getResumeById(resumeId, userId);
      const versions = await getResumeVersions(userId, resumeId);
      const latestAnalysis = await getLatestResumeAnalysis(userId, resumeId);

      return NextResponse.json({
        success: true,
        data: {
          resume,
          versions,
          latestAnalysis,
        },
      });
    }

    const resumes = await getStudentResumes(userId);
    const latestAnalysis = await getLatestResumeAnalysis(userId);

    return NextResponse.json({
      success: true,
      data: {
        resumes,
        latestAnalysis,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch student resumes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const body = await req.json();
    const savedResume = await saveStudentResume(userId, body);

    // Create version snapshot
    const versions = await getResumeVersions(userId, savedResume.id);
    await saveResumeVersion(userId, {
      resume_id: savedResume.id,
      version_number: versions.length + 1,
      name: `v${versions.length + 1} - ${savedResume.name}`,
      content_json: savedResume.content_json,
      ats_score: savedResume.ats_score,
    });

    return NextResponse.json({
      success: true,
      data: savedResume,
      message: 'Resume saved successfully!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('id');

    if (!resumeId) {
      return NextResponse.json({ success: false, error: 'Resume ID required' }, { status: 400 });
    }

    await deleteStudentResume(resumeId, userId);

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
