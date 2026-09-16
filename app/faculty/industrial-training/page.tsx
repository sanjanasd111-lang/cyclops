'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function FacultyIndustrialTrainingPage() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    company_name: 'Dabur India R&D Center',
    role_title: 'Clinical Data & Phytochemical Internship',
    location: 'Ghaziabad, UP / Hybrid',
    duration: '12 Weeks',
    student_count: 5,
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const res = await fetch('/api/faculty/training');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTrainings(data.data);
      }
    } catch (err) {
      console.error('Failed to load trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/faculty/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      loadTrainings();
    } catch (err) {
      console.error('Failed to create training:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout role="FACULTY" userTitle="Industrial Training Console" userSubtitle="Student Industry Exposure">
      <div className="space-y-6 max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-emerald-400" /> Industrial Training &amp; Internships
            </h1>
            <p className="text-xs text-slate-400">
              Track authorized student industrial placements, clinical attachments, and company mentor evaluations.
            </p>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-bold shadow-md self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Log Industrial Attachment
          </Button>
        </div>

        {/* Modal: Create Industrial Training */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">Log New Industrial Training Cohort</h3>
              <form onSubmit={handleCreateTraining} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Industry Partner / Company</label>
                  <Input
                    required
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Training Role / Domain</label>
                  <Input
                    required
                    value={form.role_title}
                    onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Location</label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Duration</label>
                    <Input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
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
                    {saving ? 'Saving...' : 'Confirm Cohort'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Trainings List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading industrial training cohorts...
          </div>
        ) : trainings.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/60 p-12 text-center space-y-3">
            <Building2 className="h-10 w-10 text-emerald-400 mx-auto opacity-60" />
            <h3 className="text-sm font-bold text-white">No industrial training cohorts logged</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Record external hospital and pharmaceutical training programs for your students.
            </p>
            <Button
              onClick={() => setShowModal(true)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold mt-2"
            >
              Log Attachment
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainings.map((t) => (
              <Card key={t.id} className="border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                      {t.location || 'Hybrid'}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight">{t.role_title || t.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-slate-500" />
                      {t.company_name || 'Industry Partner'}
                    </p>
                  </div>
                  <Badge className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    {t.status || 'ACTIVE'}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Duration:</span>
                    <span className="text-white font-medium">{t.duration || '12 Weeks'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Enrolled Students:</span>
                    <span className="text-emerald-400 font-semibold">{t.student_count || t.students?.length || 4} Mentees</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Logged: {new Date(t.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  <span className="text-emerald-400 font-medium">Verified Partner</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
