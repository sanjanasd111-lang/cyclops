"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Sparkles, Plus, Trash2, CheckCircle2, ArrowRight, Bot, RefreshCw } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UNIVERSAL_SKILL_TAXONOMY } from '@/lib/data/career-roles';

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: 'Clinical Research Associate Intern',
    opportunityType: 'INTERNSHIP',
    description: 'Work alongside senior scientific officers in standardizing AYUSH formulations, designing clinical trial case report forms (CRF), and performing biostatistics bioactivity analysis.',
    location: 'New Delhi / Remote',
    isRemote: true,
    durationMonths: 6,
    stipendAmount: 25000,
    salaryAmount: 0,
    deadline: '2027-12-31',
    allowedStreams: ['Medical, AYUSH & Healthcare', 'Science & Mathematics', 'Engineering & Technology'],
    minCgpa: 7.0,
  });

  const [selectedSkills, setSelectedSkills] = useState<Array<{ skill_id: string; skill_name: string; min_proficiency: number; is_required: boolean }>>([
    { skill_id: 's01', skill_name: 'Clinical Research', min_proficiency: 75, is_required: true },
    { skill_id: 's03', skill_name: 'Ayurvedic Pharmacology', min_proficiency: 80, is_required: true },
    { skill_id: 's02', skill_name: 'Research Methodology', min_proficiency: 70, is_required: true },
    { skill_id: 's15', skill_name: 'Biostatistics', min_proficiency: 65, is_required: false },
  ]);

  const handleAIAnalyze = async () => {
    if (!formData.description) return;
    setAnalyzingAI(true);
    try {
      const res = await fetch('/api/ai/opportunity/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleTitle: formData.title, description: formData.description }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const aiData = data.data;
        setFormData((prev) => ({
          ...prev,
          title: aiData.suggestedTitle || prev.title,
          durationMonths: aiData.suggestedDurationMonths || prev.durationMonths,
          stipendAmount: aiData.estimatedStipend || prev.stipendAmount,
        }));

        if (aiData.extractedSkills && Array.isArray(aiData.extractedSkills)) {
          const mapped = aiData.extractedSkills.map((sk: any, idx: number) => ({
            skill_id: `s-ai-${idx}`,
            skill_name: sk.skill_name,
            min_proficiency: sk.min_proficiency || 70,
            is_required: sk.is_required ?? true,
          }));
          setSelectedSkills(mapped);
        }
      }
    } catch {
      // Non-blocking AI fallback
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleAddSkillFromTaxonomy = (skillName: string) => {
    if (selectedSkills.some((s) => s.skill_name.toLowerCase() === skillName.toLowerCase())) return;
    const matched = UNIVERSAL_SKILL_TAXONOMY.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
    setSelectedSkills([
      ...selectedSkills,
      {
        skill_id: matched?.id || `s-custom-${Date.now()}`,
        skill_name: skillName,
        min_proficiency: 70,
        is_required: true,
      },
    ]);
  };

  const handleRemoveSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.skill_name !== skillName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setErrorMessage('Please select at least one required skill from the taxonomy.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/industry/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          opportunity_type: formData.opportunityType,
          location: formData.location,
          is_remote: formData.isRemote,
          duration_months: Number(formData.durationMonths),
          stipend_amount: Number(formData.stipendAmount),
          salary_amount: Number(formData.salaryAmount) || undefined,
          deadline: new Date(formData.deadline).toISOString(),
          eligibility_criteria: {
            min_cgpa: Number(formData.minCgpa),
            allowed_streams: formData.allowedStreams,
          },
          required_skills: selectedSkills,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/industry/opportunities');
      } else {
        setErrorMessage(data.error || 'Failed to create opportunity. Check fields.');
      }
    } catch {
      setErrorMessage('Network error while saving opportunity.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout role="INDUSTRY">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Zod Validated Taxonomy Opportunity Wizard
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Create New Opportunity</h1>
            <p className="text-xs text-slate-400">Post a new position mapped directly to the centralized Cyclops skill taxonomy.</p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        <Card className="border-slate-800 bg-slate-900/90 text-white p-6 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {/* Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-medium">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Opportunity Type</label>
                <select
                  value={formData.opportunityType}
                  onChange={(e) => setFormData({ ...formData, opportunityType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FULL_TIME">Full-Time Job</option>
                  <option value="PART_TIME">Part-Time</option>
                  <option value="RESEARCH_PROJECT">Research Project</option>
                  <option value="LIVE_PROJECT">Live Project</option>
                  <option value="APPRENTICESHIP">Apprenticeship</option>
                  <option value="FELLOWSHIP">Fellowship</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="MENTORSHIP">Mentorship</option>
                </select>
              </div>
            </div>

            {/* Description & AI Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Job / Role Description</label>
                <button
                  type="button"
                  onClick={handleAIAnalyze}
                  disabled={analyzingAI || !formData.description}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 hover:underline"
                >
                  {analyzingAI ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                  <span>{analyzingAI ? 'AI Extracting...' : 'AI Analyze Description'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Location, Remote, Duration, Stipend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-300 font-medium">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Duration (Months)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={36}
                  value={formData.durationMonths}
                  onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Monthly Stipend (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stipendAmount}
                  onChange={(e) => setFormData({ ...formData, stipendAmount: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Application Deadline</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Taxonomy Skill Requirements */}
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <label className="text-slate-200 font-bold block">Taxonomy Skill Requirements (Required for Match Score)</label>
              <p className="text-[11px] text-slate-400">Select skills strictly from the centralized skill taxonomy. Minimum level set for deterministic matching.</p>

              {/* Selected Skills List */}
              <div className="space-y-2 pt-1">
                {selectedSkills.map((sk, i) => (
                  <div key={sk.skill_name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="font-bold text-white">{sk.skill_name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">Min Proficiency:</span>
                        <input
                          type="number"
                          min={30}
                          max={100}
                          value={sk.min_proficiency}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSelectedSkills(selectedSkills.map((s, idx) => idx === i ? { ...s, min_proficiency: val } : s));
                          }}
                          className="w-16 rounded border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-emerald-400 text-xs text-center"
                        />
                        <span className="text-emerald-400 font-mono">%</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk.skill_name)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add taxonomy skill buttons */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-medium">Add from Centralized Skill Taxonomy:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {UNIVERSAL_SKILL_TAXONOMY.slice(0, 10).map((sk) => (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => handleAddSkillFromTaxonomy(sk.name)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-0.5 rounded"
                    >
                      + {sk.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Controls */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/industry/dashboard')}
                className="border-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                variant="emerald"
                className="gap-2 font-bold text-xs shadow-md"
              >
                <span>{saving ? 'Publishing...' : 'Publish Opportunity'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </PortalLayout>
  );
}
