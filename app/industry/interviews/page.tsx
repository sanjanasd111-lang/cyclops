"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Video, MapPin, Plus, CheckCircle2, User, Clock, ArrowRight } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function IndustryInterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    studentName: 'Aditi Sharma',
    scheduledAt: '2026-03-10T11:00',
    mode: 'ONLINE',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    interviewerName: 'Dr. Vikramaditya Sen',
    notes: 'Technical discussion on HPTLC chromatography fingerprinting protocols and biostatistics.',
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch('/api/industry/interviews');
      const data = await res.json();
      if (data.success) {
        setInterviews(data.data || []);
      }
    } catch {
      // Fallback
    }
  };

  const handleCreateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/industry/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: form.studentName,
          scheduled_at: new Date(form.scheduledAt).toISOString(),
          mode: form.mode,
          meeting_link: form.meetingLink,
          interviewer_name: form.interviewerName,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchInterviews();
      }
    } catch {
      // Fallback
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout role="INDUSTRY">
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 font-mono text-[11px]">
              Interview Scheduler
            </Badge>
            <h1 className="text-2xl font-extrabold text-white mt-1">Scheduled Interview Sessions</h1>
            <p className="text-xs text-slate-400">Manage virtual or in-person interview dates with candidate status syncing.</p>
          </div>

          <Button onClick={() => setShowModal(true)} variant="emerald" size="sm" className="gap-1.5 font-bold shadow-md text-xs">
            <Plus className="h-4 w-4" /> Schedule New Interview
          </Button>
        </div>

        {/* Schedule Modal */}
        {showModal && (
          <Card className="border-emerald-500/40 bg-slate-900/95 text-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" /> Schedule Interview Session
            </h3>

            <form onSubmit={handleCreateInterview} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.scheduledAt}
                    onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Interview Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ONLINE">Online Virtual Video</option>
                    <option value="IN_PERSON">In-Person Office</option>
                    <option value="TELEPHONIC">Telephonic</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Meeting URL (Verified Link)</label>
                  <input
                    type="url"
                    required
                    value={form.meetingLink}
                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Interviewer Name</label>
                <input
                  type="text"
                  required
                  value={form.interviewerName}
                  onChange={(e) => setForm({ ...form, interviewerName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Session Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-slate-800 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} variant="emerald" size="sm" className="font-bold text-xs">
                  {saving ? 'Scheduling...' : 'Confirm & Notify Candidate'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Interviews List */}
        <div className="space-y-3">
          {interviews.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/60 p-8 text-center space-y-2">
              <Calendar className="h-10 w-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No interviews scheduled yet</h3>
              <p className="text-xs text-slate-400">Schedule your first candidate interview to sync calendar invites and notify applicants.</p>
            </Card>
          ) : (
            interviews.map((intv) => (
              <Card key={intv.id} className="border-slate-800 bg-slate-900/90 p-5 space-y-3 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-400" /> {intv.student_name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Interviewer: {intv.interviewer_name || 'Recruiter'}</p>
                  </div>
                  <Badge variant="amber" className="text-[10px] font-mono">{intv.status}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400">Scheduled Time:</span>
                    <div className="font-bold text-white font-mono">{new Date(intv.scheduled_at).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Mode & Link:</span>
                    <div className="font-bold text-emerald-400 font-mono flex items-center gap-1">
                      <Video className="h-3.5 w-3.5" />
                      <a href={intv.meeting_link} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[200px]">
                        {intv.meeting_link || 'Virtual Link'}
                      </a>
                    </div>
                  </div>
                </div>

                {intv.notes && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-400">Notes:</strong> {intv.notes}
                  </p>
                )}
              </Card>
            ))
          )}
        </div>

      </div>
    </PortalLayout>
  );
}
