import { getStudentProfile, updateStudentProfile } from '@/lib/db/db-client';
import { StudentProfile, UserSkill } from '@/lib/types';

// Compatibility wrapper delegating strictly to user-scoped db-client
export function getActiveProfileAndSkills(userId: string = 'usr-default-session'): Promise<{ profile: StudentProfile; skills: UserSkill[] }> {
  return getStudentProfile(userId);
}

export function updateActiveProfileAndSkills(
  userId: string = 'usr-default-session',
  profileData?: Partial<StudentProfile>,
  skillsData?: UserSkill[]
): Promise<{ profile: StudentProfile; skills: UserSkill[] }> {
  return updateStudentProfile(userId, profileData, skillsData);
}
