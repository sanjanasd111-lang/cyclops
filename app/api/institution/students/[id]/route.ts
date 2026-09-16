
import { NextRequest, NextResponse } from 'next/server';
import { getInstitutionStudentById, getStudentProfile } from '@/lib/db/db-client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const student = await getInstitutionStudentById(params.id);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    const { skills } = await getStudentProfile(student.user_id || params.id);
    return NextResponse.json({ success: true, data: { profile: student, skills } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch student details' },
      { status: 500 }
    );
  }
}
