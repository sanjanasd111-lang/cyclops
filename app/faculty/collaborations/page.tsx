'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  BookOpen,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function FacultyCollaborationsPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: 'Pharmacognosy & AI Phytochemical Profiling Initiative',
    type: 'RESEARCH_PROJECT',
    description: 'Joint research collaboration between academia and industry to map botanical extract markers to biological pathways.',
    duration: '6 Months',
    location: 'Hybrid / Center of Excellence',
    eligibility: 'Postgraduate students and Faculty Co-Investigators',
  });

  useEffect(() => {
    loadCollaborations();
  }, []);

  const loadCollaborations = async () => {
    try {
      const res = await fetch('/api/industry/collaborations');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCollaborations(data.data);
      }
    } catch (err) {
      console.error('Failed to load collaborations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/industry/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      loadCollaborations();
    } catch (err) {
      console.error('Failed to create collaboration:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout role="FACULTY" userTitle="Academia-Industry Collaborations" userSubtitle="Joint Research Programs">
      <div className="space-y-6 max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Building2 className="h-6 w-6 text-emerald-400" /> Industry &amp; Inter-Institutional Collaborations
            </h1>
            <p className="text-xs text-slate-400">
              Joint research initiatives, MOUs, technology transfers, and sponsored curriculum development.
            </p>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-bold shadow-md self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Propose Joint Initiative
          </Button>
        </div>

        {/* Modal: Propose Initiative */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">Propose Academic-Industry Initiative</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Initiative Title</label>
                  <Input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Target Duration</label>
                  <Input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Description &amp; Objectives</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    className="text-xs text-slate-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    {saving ? 'Submitting...' : 'Submit Proposal'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Collaborations Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading joint initiatives...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborations.map((c) => (
              <Card key={c.id} className="border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                      {c.type || 'R&D Initiative'}
                    </Badge>
                    <h3 className="text-sm font-bold text-white leading-tight">{c.title}</h3>
                  </div>
                  <Badge className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    Active Program
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Duration:</span>
                    <span className="text-white font-medium">{c.duration || '6 Months'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Eligibility:</span>
                    <span className="text-emerald-400">{c.eligibility || 'Faculty & Students'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    MOU Active &amp; Verified
                  </span>
                  <span className="text-slate-400">{c.location || 'Hybrid'}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
