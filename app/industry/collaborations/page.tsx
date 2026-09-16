"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Building2, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function IndustryCollaborationsPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: 'AYUSH Botanical Standardization & Phytochemical Profiling',
    type: 'RESEARCH_PROJECT',
    description: 'Joint academia-industry R&D program to standardize herbal extract bioactivity markers and chemical profiles.',
    duration: '6 Months',
    location: 'New Delhi / Remote',
    eligibility: 'BAMS 4th Year / M.D. Ayurveda students',
  });

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      const res = await fetch('/api/industry/collaborations');
      const data = await res.json();
      if (data.success) setCollaborations(data.data || []);
    } catch {
      // Fallback
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/industry/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchCollaborations();
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
            <Badge variant="outline" className="border-teal-500/30 text-teal-400 font-mono text-[11px]">
              Academia-Industry Collaboration Hub
            </Badge>
            <h1 className="text-2xl font-extrabold text-white mt-1">Joint Research & Programs</h1>
            <p className="text-xs text-slate-400">Post joint R&D projects, workshops, mentorships, and industrial training initiatives.</p>
          </div>

          <Button onClick={() => setShowModal(true)} variant="emerald" size="sm" className="gap-1.5 font-bold shadow-md text-xs">
            <Plus className="h-4 w-4" /> Create Collaboration Program
          </Button>
        </div>

        {/* Modal Form */}
        {showModal && (
          <Card className="border-teal-500/40 bg-slate-900/95 text-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-teal-400" /> Create Collaboration Initiative
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Program Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Program Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="RESEARCH_PROJECT">Joint Research Project</option>
                    <option value="LIVE_PROJECT">Live Project</option>
                    <option value="INNOVATION_CHALLENGE">Innovation Challenge</option>
                    <option value="WORKSHOP">Faculty & Student Workshop</option>
                    <option value="MENTORSHIP">Mentorship Initiative</option>
                    <option value="GUEST_LECTURE">Guest Lecture Series</option>
                    <option value="INDUSTRIAL_TRAINING">Industrial Training</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Duration</label>
                  <input
                    type="text"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Description & Scope</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-slate-800 text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} variant="emerald" size="sm" className="font-bold text-xs">
                  {saving ? 'Publishing...' : 'Publish Initiative'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Collaborations List */}
        <div className="space-y-4">
          {collaborations.map((collab) => (
            <Card key={collab.id} className="border-slate-800 bg-slate-900/90 p-5 space-y-3 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{collab.title}</h3>
                  <p className="text-xs text-slate-400">{collab.company_name} • {collab.duration}</p>
                </div>
                <Badge variant="emerald" className="text-[10px] font-mono">{collab.type}</Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{collab.description}</p>
            </Card>
          ))}
        </div>

      </div>
    </PortalLayout>
  );
}
