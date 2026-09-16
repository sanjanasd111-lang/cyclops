import { UserRole } from '@/lib/types';

export const ROLE_HOME_PAGES: Record<UserRole, string> = {
  STUDENT: '/student/dashboard',
  INDUSTRY: '/industry/dashboard',
  FACULTY: '/faculty/dashboard',
  INSTITUTION: '/institution/dashboard',
  ADMIN: '/admin/dashboard',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  STUDENT: [
    'take_assessment',
    'view_skill_digital_twin',
    'view_skill_gap',
    'view_career_roadmap',
    'apply_opportunity',
    'view_digital_passport',
    'use_copilot',
  ],
  INDUSTRY: [
    'post_opportunity',
    'manage_opportunity',
    'view_candidates',
    'rank_candidates',
    'update_application_status',
    'propose_collaboration',
  ],
  FACULTY: [
    'provide_student_feedback',
    'view_mentees',
    'propose_research_project',
    'manage_fdp',
    'manage_consultancy',
  ],
  INSTITUTION: [
    'view_skill_demand_analytics',
    'generate_curriculum_recommendations',
    'view_placement_funnel',
    'manage_students',
    'manage_industry_partnerships',
  ],
  ADMIN: [
    '*', // Full system administrative access
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  if (role === 'ADMIN') return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes('*');
}

export function isRouteAllowedForRole(pathname: string, role: UserRole): boolean {
  if (role === 'ADMIN') return true;
  if (pathname.startsWith('/student') && role !== 'STUDENT') return false;
  if (pathname.startsWith('/industry') && role !== 'INDUSTRY') return false;
  if (pathname.startsWith('/faculty') && role !== 'FACULTY') return false;
  if (pathname.startsWith('/institution') && role !== 'INSTITUTION') return false;
  return true;
}
