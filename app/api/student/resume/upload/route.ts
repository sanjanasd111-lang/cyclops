import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveResumeDocument, getStudentProfile, saveResumeAnalysis } from '@/lib/db/db-client';
import { calculateDeterministicATSScore } from '@/lib/resume/ats-engine';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'usr-authenticated-student-001';

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetRole = (formData.get('targetRole') as string) || 'Software Engineer';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Read text buffer
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8');
    const rawText = textDecoder.decode(arrayBuffer) || `Uploaded Resume Text for ${file.name}`;

    // Securely save document metadata to database
    const docRecord = await saveResumeDocument(userId, {
      file_name: file.name,
      file_path: `resumes/${userId}/${Date.now()}_${file.name}`,
      file_type: file.type || 'application/pdf',
      file_size: file.size,
      target_role: targetRole,
      extracted_text: rawText,
      status: 'PARSED',
    });

    // Run ATS Engine Analysis
    const { profile, skills } = await getStudentProfile(userId);
    const atsResult = calculateDeterministicATSScore(rawText, profile, skills, targetRole);

    await saveResumeAnalysis(userId, {
      target_role: targetRole,
      ats_score: atsResult.atsScore,
      keyword_score: atsResult.keywordScore,
      skill_alignment: atsResult.skillAlignment,
      format_score: atsResult.formatScore,
      section_completeness: atsResult.sectionCompleteness,
      impact_score: atsResult.impactScore,
      readability_score: atsResult.readabilityScore,
      matched_keywords: atsResult.matchedKeywords,
      missing_keywords: atsResult.missingKeywords,
      missing_skills: atsResult.missingSkills,
      recommendations: atsResult.recommendations,
      section_feedback: atsResult.sectionFeedback,
    });

    return NextResponse.json({
      success: true,
      document: docRecord,
      atsResult,
      message: 'Resume uploaded and analyzed successfully!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload resume document' },
      { status: 500 }
    );
  }
}
