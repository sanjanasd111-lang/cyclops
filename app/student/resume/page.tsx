'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResumeRecord, ResumeContentData, ATSTemplate, ATSScoreBreakdown } from '@/lib/types/resume-types';
import { UserSkill, StudentProfile } from '@/lib/types';
import { ResumeEditor } from '@/components/resume/ResumeEditor';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ATSAnalysisPanel } from '@/components/resume/ATSAnalysisPanel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  FileText,
  Sparkles,
  Upload,
  BarChart3,
  Copy,
  Trash2,
  CheckCircle2,
  Download,
  Printer,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

function syncResumeWithProfileData(
  resume: ResumeRecord,
  prof: StudentProfile,
  skills: UserSkill[]
): { syncedResume: ResumeRecord; hasChanges: boolean } {
  let hasChanges = false;
  const content = JSON.parse(JSON.stringify(resume.content_json || {}));
  const pInfo = content.personalInfo || { fullName: '', email: '' };

  // 1. Personal Details
  if (prof.full_name && prof.full_name !== pInfo.fullName) {
    pInfo.fullName = prof.full_name;
    hasChanges = true;
  }
  if (prof.email && prof.email !== pInfo.email) {
    pInfo.email = prof.email;
    hasChanges = true;
  }
  if (prof.phone && prof.phone !== pInfo.phone) {
    pInfo.phone = prof.phone;
    hasChanges = true;
  }
  if (prof.preferred_locations?.[0] && prof.preferred_locations[0] !== pInfo.location) {
    pInfo.location = prof.preferred_locations[0];
    hasChanges = true;
  }
  if (prof.linkedin_url && prof.linkedin_url !== pInfo.linkedin) {
    pInfo.linkedin = prof.linkedin_url;
    hasChanges = true;
  }
  if (prof.github_url && prof.github_url !== pInfo.github) {
    pInfo.github = prof.github_url;
    hasChanges = true;
  }
  if (prof.portfolio_url && prof.portfolio_url !== pInfo.website) {
    pInfo.website = prof.portfolio_url;
    hasChanges = true;
  }
  if (prof.bio && (!pInfo.summary || pInfo.summary.length < 15 || prof.bio !== pInfo.summary)) {
    pInfo.summary = prof.bio;
    hasChanges = true;
  }

  // 2. Role & Headline
  const role = prof.target_role || prof.career_goal;
  if (role && (role !== resume.target_role || !pInfo.headline || !pInfo.headline.includes(role))) {
    resume.target_role = role;
    pInfo.headline = `${role} | ${prof.academic_stream || prof.course || 'Degree Candidate'}`;
    hasChanges = true;
  }

  // 3. Education
  if (content.education && content.education.length > 0) {
    const firstEd = content.education[0];
    if (prof.institution_name && firstEd.institution !== prof.institution_name) {
      firstEd.institution = prof.institution_name;
      hasChanges = true;
    }
    if (prof.degree && firstEd.degree !== prof.degree) {
      firstEd.degree = prof.degree;
      hasChanges = true;
    }
    if (prof.academic_stream && firstEd.fieldOfStudy !== prof.academic_stream) {
      firstEd.fieldOfStudy = prof.academic_stream;
      hasChanges = true;
    }
  }

  // 4. Skills synchronization
  if (skills && skills.length > 0) {
    const existing = content.skills || [];
    const existingNames = new Set(existing.map((s: any) => s.name.toLowerCase()));
    let anySkillAdded = false;

    for (const sk of skills) {
      if (!existingNames.has(sk.skill_name.toLowerCase())) {
        existing.push({
          id: sk.id || `sk-sync-${sk.skill_name}`,
          name: sk.skill_name,
          category: sk.category || 'Core Competency',
          proficiency: sk.proficiency_score,
          isVerified: sk.verification_status === 'INSTITUTION_VERIFIED' || sk.verification_status === 'INDUSTRY_VERIFIED',
        });
        existingNames.add(sk.skill_name.toLowerCase());
        anySkillAdded = true;
      }
    }
    if (anySkillAdded) {
      content.skills = existing;
      hasChanges = true;
    }
  }

  // 5. Projects synchronization
  if (prof.projects && prof.projects.length > 0) {
    const existingProj = content.projects || [];
    const existingTitles = new Set(existingProj.map((p: any) => p.title.toLowerCase()));
    let anyProjAdded = false;

    for (const pr of prof.projects) {
      if (!existingTitles.has(pr.title.toLowerCase())) {
        existingProj.push({
          id: `proj-${Date.now()}-${pr.title.slice(0, 5)}`,
          title: pr.title,
          description: pr.description || '',
          technologies: pr.skills_used || [],
          bullets: [
            `Engineered ${pr.title} utilizing ${pr.skills_used?.join(', ') || 'specialized technologies'}.`,
            `Documented specifications and completed system verification.`,
          ],
        });
        existingTitles.add(pr.title.toLowerCase());
        anyProjAdded = true;
      }
    }
    if (anyProjAdded) {
      content.projects = existingProj;
      hasChanges = true;
    }
  }

  content.personalInfo = pInfo;

  return {
    syncedResume: {
      ...resume,
      content_json: content,
      target_role: role || resume.target_role,
    },
    hasChanges,
  };
}

export default function ResumeStudioPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeRecord | null>(null);
  const [verifiedSkills, setVerifiedSkills] = useState<UserSkill[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSScoreBreakdown | null>(null);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);

  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'analyzer' | 'versions' | 'upload'>('editor');
  const [selectedTemplate, setSelectedTemplate] = useState<ATSTemplate>('modern');
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);

  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Load initial student profile, skills, and resumes
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch student profile & verified skills
        const profRes = await fetch('/api/student/profile').then((r) => r.json()).catch(() => null);
        let liveProfile: StudentProfile | null = null;
        let liveSkills: UserSkill[] = [];
        if (profRes?.success) {
          liveProfile = profRes.data.profile;
          liveSkills = profRes.data.skills || [];
          setProfile(liveProfile);
          setVerifiedSkills(liveSkills);
          if (liveProfile?.target_role || liveProfile?.career_goal) {
            setTargetRole(liveProfile.target_role || liveProfile.career_goal);
          }
        }

        // Fetch student resumes
        const resListRes = await fetch('/api/student/resume').then((r) => r.json()).catch(() => null);
        const resumesList = Array.isArray(resListRes?.data)
          ? resListRes.data
          : resListRes?.data?.resumes || [];

        if (resumesList.length > 0) {
          setResumes(resumesList);
          const defaultRes = resumesList.find((r: ResumeRecord) => r.is_default) || resumesList[0];

          // Auto-synchronize profile with default resume if profile exists
          if (liveProfile) {
            const { syncedResume, hasChanges } = syncResumeWithProfileData(
              defaultRes,
              liveProfile,
              liveSkills
            );
            setCurrentResume(syncedResume);
            setSelectedTemplate(syncedResume.template || 'modern');
            if (syncedResume.target_role) setTargetRole(syncedResume.target_role);
            if (hasChanges) {
              await saveResumeChanges(syncedResume);
              setSyncNotification('Resume automatically updated with your latest profile details!');
              setTimeout(() => setSyncNotification(null), 4000);
            }
          } else {
            setCurrentResume(defaultRes);
            setSelectedTemplate(defaultRes.template || 'modern');
            if (defaultRes.target_role) setTargetRole(defaultRes.target_role);
          }
        } else {
          // If student has no resume yet, trigger AI resume builder pre-fill
          await buildResumeFromProfile();
        }

        // Fetch latest analysis
        if (resListRes?.data?.latestAnalysis) {
          setAtsAnalysis(resListRes.data.latestAnalysis);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    // Listen for cross-page profile updates
    const handleProfileUpdate = () => {
      loadData();
    };
    window.addEventListener('ruas-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('ruas-profile-updated', handleProfileUpdate);
  }, []);

  // Pre-fill Resume from Student Profile (Option B: Student has no resume)
  const buildResumeFromProfile = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/resume-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      }).then((r) => r.json());

      if (res?.success && res.data) {
        const newRecord: Partial<ResumeRecord> = {
          name: `${targetRole} Resume`,
          target_role: targetRole,
          template: selectedTemplate,
          content_json: res.data,
          ats_score: 82,
          is_default: true,
          visibility: 'PRIVATE',
        };

        const saveRes = await fetch('/api/student/resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        }).then((r) => r.json());

        if (saveRes?.success && saveRes.data) {
          setCurrentResume(saveRes.data);
          setResumes((prev) => [saveRes.data, ...prev.filter((r) => r.id !== saveRes.data.id)]);
        }
      }
    } catch {
      // Build error
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Re-sync on demand from Real-Time Student Profile
  const handleForceSyncProfile = async () => {
    setIsGeneratingAI(true);
    setSyncNotification('Fetching latest details from your Student Profile...');
    try {
      const profRes = await fetch('/api/student/profile').then((r) => r.json()).catch(() => null);
      if (profRes?.success && profRes.data?.profile) {
        const liveProfile = profRes.data.profile;
        const liveSkills = profRes.data.skills || [];
        setProfile(liveProfile);
        setVerifiedSkills(liveSkills);
        const role = liveProfile.target_role || liveProfile.career_goal || targetRole;
        setTargetRole(role);

        // Fetch freshly generated AI grounded resume from live profile
        const aiBuildRes = await fetch('/api/ai/resume-builder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetRole: role }),
        }).then((r) => r.json());

        if (aiBuildRes?.success && aiBuildRes.data) {
          const updatedRecord: ResumeRecord = {
            ...(currentResume || {
              id: `res-${Date.now()}`,
              user_id: 'usr-authenticated-student-001',
              ats_score: 85,
              is_default: true,
              visibility: 'PRIVATE',
              created_at: new Date().toISOString(),
            }),
            name: `${role} Resume (Profile Synced)`,
            target_role: role,
            template: selectedTemplate,
            content_json: aiBuildRes.data,
            updated_at: new Date().toISOString(),
          };

          const saveRes = await fetch('/api/student/resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecord),
          }).then((r) => r.json());

          if (saveRes?.success && saveRes.data) {
            setCurrentResume(saveRes.data);
            setResumes((prev) => [saveRes.data, ...prev.filter((r) => r.id !== saveRes.data.id)]);
            setSyncNotification('Resume successfully synchronized with real-time profile!');
            setTimeout(() => setSyncNotification(null), 4000);
          }
        }
      }
    } catch {
      setSyncNotification('Failed to sync profile.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Run Deterministic + Gemini ATS Analysis
  const runATSAnalysis = async () => {
    if (!currentResume) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/resume-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: currentResume.id,
          resumeContent: currentResume.content_json,
          targetRole: targetRole || currentResume.target_role,
        }),
      }).then((r) => r.json());

      if (res?.success && res.data) {
        setAtsAnalysis(res.data);
        // Update current resume ATS score
        const updatedRes = { ...currentResume, ats_score: res.data.atsScore };
        setCurrentResume(updatedRes);
        saveResumeChanges(updatedRes);
      }
    } catch {
      // Analysis error
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save changes to current resume
  const saveResumeChanges = async (resumeToSave?: ResumeRecord) => {
    const target = resumeToSave || currentResume;
    if (!target) return;
    try {
      await fetch('/api/student/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
      });
    } catch {
      // Sync error
    }
  };

  // Handle uploaded PDF/DOCX resume file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading and parsing document...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetRole', targetRole);

      const res = await fetch('/api/student/resume/upload', {
        method: 'POST',
        body: formData,
      }).then((r) => r.json());

      if (res?.success) {
        setUploadStatus('Analysis complete!');
        if (res.atsResult) setAtsAnalysis(res.atsResult);
        setActiveMainTab('analyzer');
      } else {
        setUploadStatus(`Error: ${res.error || 'Upload failed'}`);
      }
    } catch {
      setUploadStatus('Failed to process file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Switch Resume Version
  const handleSelectResume = (resRecord: ResumeRecord) => {
    setCurrentResume(resRecord);
    setSelectedTemplate(resRecord.template || 'modern');
    if (resRecord.target_role) setTargetRole(resRecord.target_role);
  };

  // Sync missing verified skill into current resume
  const syncSkillToCurrentResume = (skillName: string) => {
    if (!currentResume) return;
    const existing = currentResume.content_json.skills || [];
    if (existing.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;

    const updatedSkills = [
      ...existing,
      {
        id: `sk-sync-${Date.now()}`,
        name: skillName,
        category: 'Verified Platform Skill',
        isVerified: true,
      },
    ];

    const updated = {
      ...currentResume,
      content_json: {
        ...currentResume.content_json,
        skills: updatedSkills,
      },
    };

    setCurrentResume(updated);
    saveResumeChanges(updated);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-semibold">Loading AI Resume Studio & Student Profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-white">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">AI Resume Studio</h1>
            <Badge className="bg-indigo-600 text-white text-xs px-2.5 py-0.5 font-mono">Production Engine</Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Build, analyze, and optimize your resume using real student profile data & deterministic ATS rubric scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleForceSyncProfile}
            disabled={isGeneratingAI}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5 shadow-md"
          >
            {isGeneratingAI ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {isGeneratingAI ? 'Syncing...' : 'Sync with Profile'}
          </Button>

          <Link href="/student/resume/report">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-bold gap-1.5 shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5" /> View Executive Report
            </Button>
          </Link>

          <Button
            onClick={runATSAnalysis}
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
          >
            {isAnalyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <BarChart3 className="h-3.5 w-3.5" />}
            {isAnalyzing ? 'Analyzing ATS...' : 'Analyze ATS Score'}
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Live Profile Grounded Connection Banner */}
      {profile && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#141824] border border-purple-500/25 text-xs text-slate-300 shadow-md">
          <div className="flex flex-wrap items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Live Student Profile Grounded:</span>
            <span className="text-purple-300 font-bold">{profile.full_name || 'Student Candidate'}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{profile.academic_stream || profile.course}</span>
            <span className="text-slate-600">•</span>
            <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-300 bg-purple-950/30">
              {profile.target_role || targetRole}
            </Badge>
          </div>
          <Button
            onClick={handleForceSyncProfile}
            disabled={isGeneratingAI}
            size="sm"
            variant="ghost"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:bg-white/5 flex items-center gap-1 font-mono h-7"
          >
            <RefreshCw className={`h-3 w-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>Re-fetch from Profile</span>
          </Button>
        </div>
      )}

      {syncNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{syncNotification}</span>
        </div>
      )}

      {(!profile?.full_name || !profile?.linkedin_url || !profile?.github_url) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-[#121524] border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-purple-200">
            <Sparkles className="h-4 w-4 text-pink-400 shrink-0" />
            <span>
              <strong>Profile Grounding:</strong> Add your verified <strong>LinkedIn &amp; GitHub profiles</strong> in your Student Profile to guarantee 100% accurate AI resume generation.
            </span>
          </div>
          <Link href="/student/profile" className="shrink-0">
            <Button size="sm" variant="outline" className="text-xs border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-900/40 h-8">
              Update Profile Links →
            </Button>
          </Link>
        </div>
      )}

      {/* Target Role & Quick Version Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-white col-span-2">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2.5 bg-indigo-950 rounded-xl border border-indigo-800 text-indigo-400">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Career Role</label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Software Engineer, Data Analyst"
                    className="bg-slate-950 border-slate-800 text-xs font-bold text-white h-8 w-48 sm:w-64"
                  />
                  <Button onClick={runATSAnalysis} size="sm" variant="ghost" className="text-xs text-indigo-400 h-8">
                    Apply
                  </Button>
                </div>
              </div>
            </div>

            {currentResume && (
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs text-slate-400">ATS Estimate</div>
                  <div className="text-xl font-black text-indigo-400 font-mono">{currentResume.ats_score}/100</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Option B Banner: Build with AI */}
        <Card className="bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-800/60 text-white">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Don&apos;t have a resume yet?
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Pre-fill all sections instantly from your Cyclops profile.
              </p>
            </div>
            <Button
              onClick={buildResumeFromProfile}
              disabled={isGeneratingAI}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs mt-2 w-full gap-1"
            >
              {isGeneratingAI ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              {isGeneratingAI ? 'Pre-filling...' : 'Build My Resume with AI'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Mode Navigation Tabs */}
      <Tabs value={activeMainTab} onValueChange={(v: any) => setActiveMainTab(v)} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1 w-full justify-start overflow-x-auto text-xs">
          <TabsTrigger value="editor" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Resume Editor & Live A4 Preview
          </TabsTrigger>
          <TabsTrigger value="analyzer" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" /> ATS Score & AI Coach
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Upload File (PDF/DOCX)
          </TabsTrigger>
          <TabsTrigger value="versions" className="gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Resume Versions ({resumes.length})
          </TabsTrigger>
        </TabsList>

        {/* MAIN TAB 1: EDITOR & LIVE PREVIEW */}
        <TabsContent value="editor" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Editor Panel (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-4">
              {currentResume ? (
                <ResumeEditor
                  data={currentResume.content_json}
                  onChange={(updatedContent) => {
                    const updatedRec = { ...currentResume, content_json: updatedContent };
                    setCurrentResume(updatedRec);
                    saveResumeChanges(updatedRec);
                  }}
                  verifiedSkills={verifiedSkills}
                  template={selectedTemplate}
                  onTemplateChange={(tmpl) => {
                    setSelectedTemplate(tmpl);
                    const updatedRec = { ...currentResume, template: tmpl };
                    setCurrentResume(updatedRec);
                    saveResumeChanges(updatedRec);
                  }}
                  onGenerateAI={buildResumeFromProfile}
                  isGeneratingAI={isGeneratingAI}
                />
              ) : (
                <Card className="bg-slate-900 border-slate-800 p-6 text-center text-slate-400">
                  <p className="text-xs">No active resume selected. Click below to create your first resume.</p>
                  <Button onClick={buildResumeFromProfile} size="sm" className="bg-indigo-600 text-white mt-3 text-xs">
                    Create Resume
                  </Button>
                </Card>
              )}
            </div>

            {/* Right Col: Live A4 Document Preview (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-indigo-400" /> Live A4 Document Preview
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Zoom:</span>
                  <select
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number(e.target.value))}
                    className="bg-slate-950 text-white text-xs border border-slate-800 rounded px-2 py-1"
                  >
                    <option value={0.65}>65%</option>
                    <option value={0.75}>75%</option>
                    <option value={0.85}>85%</option>
                    <option value={1.0}>100%</option>
                  </select>
                </div>
              </div>

              {currentResume ? (
                <ResumePreview
                  data={currentResume.content_json}
                  template={selectedTemplate}
                  zoom={zoomLevel}
                />
              ) : (
                <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
                  Resume preview will appear here.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* MAIN TAB 2: ATS SCORE & AI COACH */}
        <TabsContent value="analyzer" className="pt-4">
          <ATSAnalysisPanel
            analysis={atsAnalysis}
            onSyncSkillToResume={syncSkillToCurrentResume}
          />
        </TabsContent>

        {/* MAIN TAB 3: UPLOAD FILE */}
        <TabsContent value="upload" className="pt-4 space-y-4">
          <Card className="bg-slate-900 border-slate-800 text-white p-6 max-w-2xl mx-auto">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Upload className="h-5 w-5 text-indigo-400" /> Upload Existing Resume Document
              </CardTitle>
              <p className="text-xs text-slate-400">
                Upload your PDF or DOCX resume to extract text and analyze ATS compatibility securely.
              </p>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950 p-8 rounded-xl text-center space-y-3 transition-colors">
                <Upload className="h-10 w-10 text-indigo-400 mx-auto" />
                <div>
                  <label htmlFor="file-upload-input" className="cursor-pointer text-xs font-bold text-indigo-400 hover:underline">
                    Click to select file
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1">Supports PDF, DOCX, TXT (Max 5MB)</p>
                </div>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-xs text-indigo-400">
                  <RefreshCw className="h-4 w-4 animate-spin" /> {uploadStatus}
                </div>
              )}

              {uploadStatus && !isUploading && (
                <div className="text-xs text-center font-medium text-emerald-400">{uploadStatus}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MAIN TAB 4: RESUME VERSIONS */}
        <TabsContent value="versions" className="pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Your Saved Resume Versions</h3>
            <Button onClick={buildResumeFromProfile} size="sm" className="bg-indigo-600 text-white text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Create New Resume Version
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => (
              <Card
                key={r.id}
                className={`bg-slate-900 border text-white transition-all ${
                  currentResume?.id === r.id ? 'border-indigo-500 shadow-lg shadow-indigo-950/40' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-white">{r.name}</h4>
                      <p className="text-xs text-indigo-400 font-medium mt-0.5">{r.target_role}</p>
                    </div>
                    {r.is_default && (
                      <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">Default</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
                    <span>ATS Score: {r.ats_score}/100</span>
                    <span>Template: {r.template}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => handleSelectResume(r)}
                      size="sm"
                      variant={currentResume?.id === r.id ? 'default' : 'outline'}
                      className="text-xs w-full gap-1 h-8"
                    >
                      {currentResume?.id === r.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {currentResume?.id === r.id ? 'Active Editor' : 'Select'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
