'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  FileText,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function FacultyResearchPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Clinical Trial',
    target_skills: 'Biostatistics, Pharmacovigilance, GCP',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/faculty/research');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to load research projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    try {
      const skillsArray = form.target_skills.split(',').map((s) => s.trim()).filter(Boolean);
      await fetch('/api/faculty/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          target_skills: skillsArray,
          status: form.status,
        }),
      });
      setShowCreateModal(false);
      setForm({
        title: '',
        description: '',
        category: 'Clinical Trial',
        target_skills: 'Biostatistics, Pharmacovigilance, GCP',
        status: 'ACTIVE',
      });
      loadProjects();
    } catch (err) {
      console.error('Failed to create research project:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout role="FACULTY" userTitle="Faculty Research Projects" userSubtitle="Academic R&D Console">
      <div className="space-y-6 max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-400" /> Research &amp; Clinical Projects
            </h1>
            <p className="text-xs text-slate-400">
              Manage ongoing investigations, publish grant proposals, and coordinate student research assistants.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs font-bold shadow-md self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Research Project
          </Button>
        </div>

        {/* Modal: Create Research Project */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">Add New Research Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Project Title</label>
                  <Input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Phytochemical Standardization Study"
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Research Focus / Category</label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Clinical Trial, Pharmacognosy, AI Discovery"
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Target Skills (comma separated)</label>
                  <Input
                    value={form.target_skills}
                    onChange={(e) => setForm({ ...form, target_skills: e.target.value })}
                    placeholder="Biostatistics, Clinical Research, Data Analysis"
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Detailed study protocols, clinical targets, and student research duties..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
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
                    {saving ? 'Creating...' : 'Save Project'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading research projects...
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/60 p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-emerald-400 mx-auto opacity-60" />
            <h3 className="text-sm font-bold text-white">No research projects recorded</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start by creating your first laboratory investigation or clinical trial project.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold mt-2"
            >
              Add Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <Card key={proj.id} className="border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                      {proj.category || 'Research'}
                    </Badge>
                    <h3 className="text-sm font-bold text-white mt-1 leading-snug">{proj.title}</h3>
                  </div>
                  <Badge className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    {proj.status || 'ACTIVE'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {proj.description || 'Ongoing academic research investigation.'}
                </p>

                {proj.target_skills && proj.target_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.target_skills.map((s: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    {new Date(proj.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Users className="h-3 w-3" />
                    {proj.collaborators?.length || 1} Investigators
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
