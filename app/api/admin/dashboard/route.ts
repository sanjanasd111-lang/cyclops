import { NextResponse } from 'next/server';
import {
  getOrganizationVerifications,
  getAuditLogs,
  getSystemHealthStatus,
  getAdminDashboardStats,
  getVerificationHistory,
} from '@/lib/db/db-client';

export async function GET() {
  const [stats, verifications, auditLogs, healthStatus, verificationHistory] = await Promise.all([
    getAdminDashboardStats(),
    getOrganizationVerifications(),
    getAuditLogs(),
    getSystemHealthStatus(),
    getVerificationHistory(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      stats,
      verifications,
      auditLogs,
      healthStatus,
      verificationHistory,
    },
  });
}
