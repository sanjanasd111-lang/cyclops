'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, Clock, Search, Filter } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (json.data?.auditLogs) setLogs(json.data.auditLogs);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (loading) {
    return (
      <PortalLayout role="ADMIN" userTitle="Super Administrator">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3 text-slate-300">
            <FileText className="w-8 h-8 text-teal-400 animate-pulse" />
            <span className="text-lg font-medium">Loading Security Audit Trail...</span>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const filteredLogs = logs.filter((l) => {
    const matchesRole = roleFilter === 'ALL' || l.user_role === roleFilter;
    const matchesSearch =
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(search.toLowerCase()) ||
      (l.entity_id && l.entity_id.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PortalLayout role="ADMIN" userTitle="Super Administrator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* Header */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <FileText className="w-7 h-7 text-teal-400" />
            <span>Security Audit Trail & Governance Logs ({logs.length})</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Track administrative verifications, role permission changes, application status updates, and security events.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, entity type, or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="INSTITUTION">Institution</option>
            <option value="INDUSTRY">Industry</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>

        {/* Audit Table */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto space-y-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">User Role</th>
                <th className="pb-3 px-3">Action Performed</th>
                <th className="pb-3 px-3">Entity Type</th>
                <th className="pb-3 px-3">Entity ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-300 border border-slate-700">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{log.action}</td>
                    <td className="py-3 px-3 text-slate-300">{log.entity_type}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{log.entity_id || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 7.16 Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Page {page} of {totalPages} ({filteredLogs.length} total entries)
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border-slate-800 text-slate-300 text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="border-slate-800 text-slate-300 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </PortalLayout>
  );
}
