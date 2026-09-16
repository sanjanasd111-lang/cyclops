'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Filter,
  AlertTriangle,
  X,
  Clock,
  Building2,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Confirmation Modal State
  const [confirmModalUser, setConfirmModalUser] = useState<any | null>(null);
  const [targetAction, setTargetAction] = useState<'SUSPEND' | 'REACTIVATE'>('SUSPEND');
  const [isUpdating, setIsUpdating] = useState(false);

  // View User Modal State
  const [viewingUser, setViewingUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (roleFilter !== 'ALL') queryParams.append('role', roleFilter);
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
      if (search) queryParams.append('search', search);

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
      const json = await res.json();
      if (json.data) setUsers(json.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, search]);

  const handleActionClick = (user: any, action: 'SUSPEND' | 'REACTIVATE') => {
    setConfirmModalUser(user);
    setTargetAction(action);
  };

  const handleExecuteStatusChange = async () => {
    if (!confirmModalUser) return;
    setIsUpdating(true);
    const newStatus = targetAction === 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE';

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: confirmModalUser.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === confirmModalUser.id ? { ...u, status: newStatus } : u))
        );
        setConfirmModalUser(null);
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PortalLayout role="ADMIN" userTitle="Super Administrator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* Header */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <Users className="w-7 h-7 text-teal-400" />
            <span>User Account Governance ({users.length})</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Inspect, filter, verify, and manage permissions across student, recruiter, faculty, and institutional administrator accounts.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or institution..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="INDUSTRY">Industry</option>
            <option value="INSTITUTION">Institution</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                <th className="pb-3 px-3">User & Organization</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Academic Stream</th>
                <th className="pb-3 px-3">Created Date</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-slate-400 text-[11px]">{u.email}</div>
                    {u.institution && (
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Building2 className="w-2.5 h-2.5" />
                        <span>{u.institution}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-300 border border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{u.branch}</td>
                  <td className="py-3.5 px-3 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{u.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => setViewingUser(u)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
                    >
                      View
                    </button>
                    {u.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleActionClick(u, 'SUSPEND')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 font-semibold"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActionClick(u, 'REACTIVATE')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 font-semibold"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* 7.17 ADMIN ACTION CONFIRMATION MODAL */}
      {confirmModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">
                Confirm User {targetAction === 'SUSPEND' ? 'Suspension' : 'Reactivation'}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to {targetAction.toLowerCase()} the account for{' '}
              <strong className="text-white">{confirmModalUser.name}</strong> ({confirmModalUser.email})?
              {targetAction === 'SUSPEND'
                ? ' The user will immediately be barred from signing in and accessing dashboard features.'
                : ' The user will regain full role access.'}
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={() => setConfirmModalUser(null)}
                className="border-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExecuteStatusChange}
                disabled={isUpdating}
                className={`text-xs font-bold ${
                  targetAction === 'SUSPEND'
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isUpdating ? 'Processing...' : `Confirm ${targetAction}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW USER MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Account Profile Details</span>
              </h3>
              <button onClick={() => setViewingUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block">Full Name:</span>
                <span className="text-white font-bold text-sm">{viewingUser.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email Address:</span>
                <span className="text-white font-mono">{viewingUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Role:</span>
                <span className="text-teal-300 font-bold">{viewingUser.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Academic Stream / Domain:</span>
                <span className="text-slate-200">{viewingUser.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Associated Institution / Org:</span>
                <span className="text-slate-200">{viewingUser.institution || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Registration Timestamp:</span>
                <span className="text-slate-300">{new Date(viewingUser.created_at).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <Button onClick={() => setViewingUser(null)} className="bg-slate-800 text-white text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
