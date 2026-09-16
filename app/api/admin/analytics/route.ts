import { NextResponse } from 'next/server';
import { getAdminDashboardStats, getAdminUsers, getOpportunities, getOrganizationVerifications, getAuditLogs } from '@/lib/db/db-client';

export async function GET() {
  try {
    const [stats, users, opps, verifications, auditLogs] = await Promise.all([
      getAdminDashboardStats(),
      getAdminUsers(),
      getOpportunities(),
      getOrganizationVerifications(),
      getAuditLogs(),
    ]);

    // Role breakdown
    const roleDistribution = [
      { role: 'STUDENT', count: users.filter((u) => u.role === 'STUDENT').length },
      { role: 'INDUSTRY', count: users.filter((u) => u.role === 'INDUSTRY').length },
      { role: 'FACULTY', count: users.filter((u) => u.role === 'FACULTY').length },
      { role: 'INSTITUTION', count: users.filter((u) => u.role === 'INSTITUTION').length },
      { role: 'ADMIN', count: users.filter((u) => u.role === 'ADMIN').length },
    ];

    // Branch breakdown
    const branchDistribution = [
      { branch: 'Computer Science & Engineering', count: users.filter((u) => u.branch?.includes('Computer')).length },
      { branch: 'Mechanical Engineering', count: users.filter((u) => u.branch?.includes('Mechanical')).length },
      { branch: 'Medical, AYUSH & Healthcare', count: users.filter((u) => u.branch?.includes('Medical') || u.branch?.includes('AYUSH') || u.branch?.includes('Healthcare')).length },
      { branch: 'Central Administration', count: users.filter((u) => u.branch?.includes('Administration')).length },
      { branch: 'Governance & Security', count: users.filter((u) => u.branch?.includes('Governance')).length },
    ];

    // Recent activity metrics
    const activitySummary = {
      recentAuditEvents: auditLogs.slice(0, 10),
      totalOpportunities: opps.length,
      activeOpportunities: opps.filter((o) => o.status === 'ACTIVE').length,
      verifiedOrganizations: verifications.filter((v) => v.verification_status === 'VERIFIED').length,
      pendingVerifications: verifications.filter((v) => v.verification_status === 'PENDING').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        roleDistribution,
        branchDistribution,
        activitySummary,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
