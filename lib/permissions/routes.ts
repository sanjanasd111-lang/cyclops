import { UserRole } from '@/lib/types';

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  STUDENT: '/student/dashboard',
  INDUSTRY: '/industry/dashboard',
  INSTITUTION: '/institution/dashboard',
  FACULTY: '/faculty/dashboard',
  ADMIN: '/admin/dashboard',
};

export const ROLE_ONBOARDING: Record<UserRole, string> = {
  STUDENT: '/student/onboarding',
  INDUSTRY: '/industry/onboarding',
  INSTITUTION: '/institution/onboarding',
  FACULTY: '/faculty/onboarding',
  ADMIN: '/admin/dashboard',
};

export function getDashboardRoute(role?: UserRole | string | null): string {
  if (!role) return '/student/dashboard';
  const uppercaseRole = role.toUpperCase() as UserRole;
  return ROLE_DASHBOARDS[uppercaseRole] || '/student/dashboard';
}

export function getOnboardingRoute(role?: UserRole | string | null): string {
  if (!role) return '/student/onboarding';
  const uppercaseRole = role.toUpperCase() as UserRole;
  return ROLE_ONBOARDING[uppercaseRole] || '/student/onboarding';
}
