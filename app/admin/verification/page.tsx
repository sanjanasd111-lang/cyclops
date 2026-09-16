'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Clock,
  Sparkles,
  AlertTriangle,
  History,
  X,
  FileCheck,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminVerificationPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification Review Action Modal
  const [activeOrg, setActiveOrg] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'VERIFIED' | 'REJECTED' | 'SUSPENDED'>('VERIFIED');
  const [actionReason, setActionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (json.data?.verifications) setVerifications(json.data.verifications);
        if (json.data?.verificationHistory) setHistory(json.data.verificationHistory);
      } catch (err) {
        console.error('Failed to load verifications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openActionModal = (org: any, type: 'VERIFIED' | 'REJECTED' | 'SUSPENDED') => {
    setActiveOrg(org);
    setActionType(type);
    setActionReason(
      type === 'VERIFIED'
        ? 'Verified accredited legal credentials and official domain.'
        : type === 'REJECTED'
        ? 'Accreditation documents or domain records could not be verified.'
        : 'Suspended pending compliance investigation.'
    );
  };

  const handleExecuteVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeOrg.id,
          status: actionType,
          notes: actionReason,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setVerifications((prev) =>
          prev.map((v) =>
            v.id === activeOrg.id ? { ...v, verification_status: actionType, notes: actionReason } : v
          )
        );

        setHistory((prev) => [
          {
            id: `vh-${Date.now()}`,
            organization_id: activeOrg.id,
            action: actionType === 'VERIFIED' ? 'APPROVED' : actionType,
            previous_status: activeOrg.verification_status,
            new_status: actionType,
            admin_id: 'admin-governance-01',
            reason: actionReason,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);

        setActiveOrg(null);
      }
    } catch (err) {
      console.error('Failed to execute verification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout role="ADMIN" userTitle="Super Administrator">
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3 text-slate-300">
            <ShieldCheck className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="text-lg font-medium">Loading Organization Verification Requests...</span>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="ADMIN" userTitle="Super Administrator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
        
        {/* Header */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>Organization Verification Hub ({verifications.length})</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Review corporate tax credentials, institutional MOUs, grant verified status badges, and maintain audit histories.
          </p>
        </div>

        {/* Verification Queue */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <FileCheck className="w-5 h-5 text-teal-400" />
            <span>Organization Verification Queue</span>
          </h2>

          <div className="space-y-4">
            {verifications.map((org) => {
              const isVerified = org.verification_status === 'VERIFIED';
              const isPending = org.verification_status === 'PENDING';
              const isSuspended = org.verification_status === 'SUSPENDED';

              return (
                <div
                  key={org.id}
                  className="p-5 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-bold text-white">{org.organization_name}</span>
                      
                      {/* 7.4 VERIFIED BADGE RULE */}
                      {isVerified ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>✓ Verified Organization</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Pending Verification</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400">
                      Type: <span className="text-slate-300 font-semibold">{org.organization_type}</span> • Notes: {org.notes}
                    </div>
                    {org.verified_at && (
                      <div className="text-[11px] text-slate-500">
                        Actioned: {new Date(org.verified_at).toLocaleDateString()} by {org.verified_by}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {!isVerified && (
                      <button
                        onClick={() => openActionModal(org, 'VERIFIED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                      >
                        Approve & Verify
                      </button>
                    )}
                    {isVerified && (
                      <button
                        onClick={() => openActionModal(org, 'SUSPENDED')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-xs hover:bg-amber-500/20"
                      >
                        Suspend
                      </button>
                    )}
                    <button
                      onClick={() => openActionModal(org, 'REJECTED')}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold text-xs hover:bg-rose-500/20"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7.5 VERIFICATION HISTORY TIMELINE */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <History className="w-5 h-5 text-teal-400" />
            <span>Verification Audit Trail & History</span>
          </h2>

          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">
                    Action: <span className="text-teal-300">{h.action}</span> ({h.previous_status || 'PENDING'} → {h.new_status})
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Reason: {h.reason || 'Verified credentials'} • Reviewer: {h.admin_id}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  {new Date(h.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* VERIFICATION ACTION MODAL */}
      {activeOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleExecuteVerification}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Execute Verification Decision</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveOrg(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Apply action <strong className="text-white">{actionType}</strong> for{' '}
              <strong className="text-white">{activeOrg.organization_name}</strong>. This update will be permanently recorded in the verification audit history.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-semibold">Governance Reason / Verification Note</label>
              <textarea
                rows={3}
                required
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-xs"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveOrg(null)}
                className="border-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`text-xs font-bold ${
                  actionType === 'VERIFIED'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
                }`}
              >
                {isSubmitting ? 'Recording...' : `Confirm ${actionType}`}
              </Button>
            </div>
          </form>
        </div>
      )}
    </PortalLayout>
  );
}
