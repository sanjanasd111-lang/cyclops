'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Linkedin,
  Github,
  Phone,
  Mail,
  MapPin,
  PartyPopper,
  Check,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StudentProfile, UserSkill } from '@/lib/types';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Academic
  const [degree, setDegree] = useState('Bachelor of Technology (B.Tech)');
  const [academicStream, setAcademicStream] = useState('Computer Science & Engineering');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [institutionName, setInstitutionName] = useState('RUAS Institute of Technology, Bengaluru');
  const [year, setYear] = useState(4);

  // Career Goal
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [preferredWorkType, setPreferredWorkType] = useState('Hybrid');
  const [availability, setAvailability] = useState('Immediate');

  // Skills & Projects
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Core Competency');
  const [projects, setProjects] = useState<Array<{ title: string; description: string; skills_used: string[] }>>([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectSkills, setNewProjectSkills] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/student/profile');
        const json = await res.json();
        if (json.success && json.data) {
          const p = json.data.profile as StudentProfile;
          setProfile(p);
          setSkills(json.data.skills || []);

          setFullName(p.full_name || '');
          setEmail(p.email || 'student@university.edu');
          setPhone(p.phone || '+91 98765 43210');
          setLocation(p.preferred_locations?.[0] || 'Bengaluru, India');
          setBio(p.bio || '');
          setLinkedinUrl(p.linkedin_url || '');
          setGithubUrl(p.github_url || '');
          setPortfolioUrl(p.portfolio_url || '');

          setDegree(p.degree || 'Bachelor of Technology (B.Tech)');
          setAcademicStream(p.academic_stream || p.course || 'Computer Science & Engineering');
          setDepartment(p.department || p.academic_stream || 'Computer Science & Engineering');
          setInstitutionName(p.institution_name || 'RUAS Institute of Technology, Bengaluru');
          setYear(p.year || 4);

          setTargetRole(p.target_role || p.career_goal || 'Full Stack Software Engineer');
          setPreferredWorkType(p.preferred_work_type || 'Hybrid');
          setAvailability(p.availability || 'Immediate');

          setProjects(p.projects || [
            {
              title: 'Distributed Microservices & API Gateway',
              description: 'Engineered a high-performance RESTful API gateway with request caching and OAuth2 authentication.',
              skills_used: ['JavaScript', 'Node.js', 'React', 'SQL'],
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Compute dynamic completion score across 7 key dimensions (0 - 100%)
  const calculateCompleteness = () => {
    let score = 0;
    if (fullName.trim().length > 1) score += 15;
    if (academicStream.trim().length > 1 && degree.trim().length > 1) score += 15;
    if (targetRole.trim().length > 1) score += 15;
    if (skills.length > 0) score += 15;
    if (linkedinUrl.trim().length > 5 || githubUrl.trim().length > 5) score += 15;
    if (projects.length > 0) score += 15;
    if (bio.trim().length > 5 || phone.trim().length > 4) score += 10;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: UserSkill = {
      id: `sk-custom-${Date.now()}`,
      student_id: profile?.user_id || 'curr-student',
      skill_id: `s-${Date.now()}`,
      skill_name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency_score: 80,
      verification_status: 'SELF_DECLARED',
      confidence_score: 85,
      updated_at: new Date().toISOString(),
    };
    setSkills((prev) => [...prev, newSkill]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const handleAddProject = () => {
    if (!newProjectTitle.trim()) return;
    const splitSkills = newProjectSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setProjects((prev) => [
      ...prev,
      {
        title: newProjectTitle.trim(),
        description: newProjectDesc.trim() || 'Academic and engineering demonstration project.',
        skills_used: splitSkills.length > 0 ? splitSkills : ['General Competency'],
      },
    ]);
    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectSkills('');
  };

  const handleRemoveProject = (index: number) => {
    setProjects((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const updatedProfilePayload: Partial<StudentProfile> = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      preferred_locations: [location.trim()],
      bio: bio.trim(),
      linkedin_url: linkedinUrl.trim(),
      github_url: githubUrl.trim(),
      portfolio_url: portfolioUrl.trim(),
      degree: degree.trim(),
      academic_stream: academicStream.trim(),
      department: department.trim(),
      institution_name: institutionName.trim(),
      year: Number(year),
      target_role: targetRole.trim(),
      career_goal: targetRole.trim(),
      preferred_work_type: preferredWorkType,
      availability,
      projects,
      profile_completed: completeness >= 90,
    };

    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: updatedProfilePayload,
          skills,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data.profile);
        setShowSuccessModal(true);

        // Pre-build and synchronize default resume in the background
        try {
          fetch('/api/ai/resume-builder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetRole: targetRole.trim() }),
          })
            .then((r) => r.json())
            .then((aiRes) => {
              if (aiRes?.success && aiRes.data) {
                fetch('/api/student/resume', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: `${targetRole.trim()} Resume`,
                    target_role: targetRole.trim(),
                    template: 'modern',
                    content_json: aiRes.data,
                    ats_score: 85,
                    is_default: true,
                  }),
                });
              }
            })
            .catch(() => {});
        } catch {}

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('ruas-profile-updated', { detail: data.data }));
        }
      }
    } catch (err) {
      console.error('Failed to update student profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout role="STUDENT" userTitle={fullName || 'Student'} userSubtitle="Loading Profile...">
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[60vh]">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-500 mb-3" />
          <p className="text-sm font-semibold">Loading Student Identity & Profile Telemetry...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="STUDENT" userTitle={fullName || 'Student Profile'} userSubtitle={`${academicStream} • Year ${year}`}>
      <div className="space-y-6 max-w-5xl mx-auto text-white">

        {/* Top Header Card */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1b1038] via-[#141828] to-[#121524] border border-purple-500/25 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <User className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">Student Identity &amp; Profile Hub</h1>
              <Badge className={completeness === 100 ? "bg-emerald-600 text-white" : "bg-purple-900/60 text-purple-300 border border-purple-500/30"}>
                {completeness}% Complete
              </Badge>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Maintain your official university student record, verified professional links, and skill parameters. Real details directly calibrate your AI Resume Studio and candidate discovery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleSaveProfile()}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-bold gap-2 px-5 py-2.5 shadow-lg shadow-purple-900/30 card-hover-lift"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{saving ? 'Saving Profile...' : 'Save & Calibrate Profile'}</span>
            </Button>
          </div>
        </div>

        {/* Live Profile Completeness Checklist Progress Bar */}
        <Card className="border-purple-500/30 bg-[#121524] shadow-xl">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Profile Calibration Meter</span>
              </div>
              <span className="font-mono text-sm font-black text-cyan-400">{completeness}% / 100%</span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  completeness === 100
                    ? 'bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 shadow-lg shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2 text-[10px] font-mono">
              <div className={`flex items-center gap-1.5 ${fullName.trim().length > 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {fullName.trim().length > 1 ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-600" />}
                <span>Full Name</span>
              </div>
              <div className={`flex items-center gap-1.5 ${academicStream.trim().length > 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {academicStream.trim().length > 1 ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-600" />}
                <span>Academic Stream</span>
              </div>
              <div className={`flex items-center gap-1.5 ${targetRole.trim().length > 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {targetRole.trim().length > 1 ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-600" />}
                <span>Target Role</span>
              </div>
              <div className={`flex items-center gap-1.5 ${skills.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {skills.length > 0 ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-600" />}
                <span>Skills ({skills.length})</span>
              </div>
              <div className={`flex items-center gap-1.5 ${(linkedinUrl.trim().length > 5 || githubUrl.trim().length > 5) ? 'text-emerald-400' : 'text-slate-500'}`}>
                {(linkedinUrl.trim().length > 5 || githubUrl.trim().length > 5) ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-600" />}
                <span>LinkedIn / GitHub</span>
              </div>
              <div className={`flex items-center gap-1.5 ${projects.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {projects.length > 0 ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-600" />}
                <span>Projects ({projects.length})</span>
              </div>
              <div className={`flex items-center gap-1.5 ${bio.trim().length > 5 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {bio.trim().length > 5 ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full border border-slate-600" />}
                <span>Bio &amp; Contact</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Personal & Contact Details */}
        <Card className="border-white/5 bg-[#141824] shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              <span>Personal Identity &amp; Contact Information</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Your name as entered here will be displayed across greetings, application submissions, and AI resume headers.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Full Name <span className="text-pink-400">*</span>
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Nair, Aditi Sharma"
                  className="bg-[#0b0e17] border-white/10 text-xs font-bold text-white focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Email Address <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="bg-[#0b0e17] border-white/10 text-xs font-medium text-slate-300 pl-8 focus:border-purple-500"
                  />
                  <Mail className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="bg-[#0b0e17] border-white/10 text-xs font-medium text-slate-300 pl-8 focus:border-purple-500"
                  />
                  <Phone className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Current Location / City
                </label>
                <div className="relative">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                    className="bg-[#0b0e17] border-white/10 text-xs font-medium text-slate-300 pl-8 focus:border-purple-500"
                  />
                  <MapPin className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Professional Bio &amp; Executive Summary
              </label>
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your discipline background, key technical strengths, and career aspirations..."
                className="bg-[#0b0e17] border-white/10 text-xs text-slate-200 focus:border-purple-500 leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Professional & Social Profiles (LinkedIn + GitHub) */}
        <Card className="border-white/5 bg-[#141824] shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>Professional Profiles &amp; Developer Links</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Add your LinkedIn and GitHub profiles. Recruiters and AI resume generators prioritize candidates with verified links.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LinkedIn Field */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 text-blue-400" /> LinkedIn Profile URL
                  </span>
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Verify Link</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </label>
                <div className="relative">
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-[#0b0e17] border-white/10 text-xs font-mono text-cyan-300 pl-8 focus:border-cyan-500"
                  />
                  <Linkedin className="h-3.5 w-3.5 text-blue-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* GitHub Field */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5 text-slate-300" /> GitHub Profile URL
                  </span>
                  {githubUrl && (
                    <a
                      href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Verify Link</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </label>
                <div className="relative">
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="bg-[#0b0e17] border-white/10 text-xs font-mono text-slate-200 pl-8 focus:border-purple-500"
                  />
                  <Github className="h-3.5 w-3.5 text-slate-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Portfolio Link */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Personal Portfolio / Research Website
                </label>
                <div className="relative">
                  <Input
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="bg-[#0b0e17] border-white/10 text-xs font-mono text-slate-300 pl-8 focus:border-purple-500"
                  />
                  <Globe className="h-3.5 w-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Academic Background & University Record */}
        <Card className="border-white/5 bg-[#141824] shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span>Academic Program &amp; University Record</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Calibrates branch-specific question pools, faculty mentors, and specialized employer listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Academic Degree</label>
                <Input
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                  className="bg-[#0b0e17] border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Academic Branch / Specialization</label>
                <select
                  value={academicStream}
                  onChange={(e) => {
                    setAcademicStream(e.target.value);
                    setDepartment(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0e17] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="Mechanical & Mechatronics Engineering">Mechanical & Mechatronics Engineering</option>
                  <option value="Ayurvedic Medicine & Surgery (BAMS)">Ayurvedic Medicine & Surgery (BAMS)</option>
                  <option value="Pharmacy & Pharmaceutical Sciences">Pharmacy & Pharmaceutical Sciences</option>
                  <option value="Biotechnology & Bio-Engineering">Biotechnology & Bio-Engineering</option>
                  <option value="Commerce & Financial Analytics">Commerce & Financial Analytics</option>
                  <option value="Management & MBA">Management & MBA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Current Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0e17] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year / Final Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Institution / University</label>
                <Input
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. RUAS Institute of Technology"
                  className="bg-[#0b0e17] border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Target Career Role & Intentions */}
        <Card className="border-white/5 bg-[#141824] shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-400" />
              <span>Target Role &amp; Recruitment Intentions</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Drives the 7-part match scoring algorithm and interview preparation simulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Target Career Role <span className="text-pink-400">*</span>
                </label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Scientist"
                  className="bg-[#0b0e17] border-white/10 text-xs font-bold text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Preferred Work Type</label>
                <select
                  value={preferredWorkType}
                  onChange={(e) => setPreferredWorkType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0e17] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0e17] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Immediate">Immediate Availability</option>
                  <option value="30 Days">30 Days Notice</option>
                  <option value="Final Semester">Post Final Semester</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Skills & Competencies Manager */}
        <Card className="border-white/5 bg-[#141824] shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-cyan-400" />
                <span>Verified &amp; Self-Declared Skills ({skills.length})</span>
              </div>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Skills mapped to your 8-axis Skill Digital Twin.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Existing Skills List */}
            <div className="flex flex-wrap gap-2.5">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b0e17] border border-white/10 text-xs font-medium"
                >
                  <span className="text-slate-200">{s.skill_name}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{s.proficiency_score}%</span>
                  {s.verification_status === 'INSTITUTION_VERIFIED' && (
                    <span title="Institution Verified">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.id)}
                    className="text-slate-500 hover:text-pink-400 transition-colors ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/5">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Enter skill name (e.g. Next.js, PyTorch, HPTLC)"
                className="bg-[#0b0e17] border-white/10 text-xs text-white flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#0b0e17] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="Core Competency">Core Competency</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Domain Research">Domain Research</option>
              </select>
              <Button onClick={handleAddSkill} size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Capstone Projects & Practical Experience */}
        <Card className="border-white/5 bg-[#141824] shadow-xl">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span>Projects &amp; Academic Capstones ({projects.length})</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Practical engineering or research deliverables included in your AI Resume and public portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0b0e17] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(idx)}
                      className="text-slate-500 hover:text-pink-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(proj.skills_used || []).map((sk, sIdx) => (
                      <Badge key={sIdx} variant="secondary" className="bg-[#1c2236] text-[10px] text-slate-300 border border-white/5">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Project Form */}
            <div className="p-4 rounded-xl bg-[#0b0e17] border border-white/10 space-y-3">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Academic or Demonstration Project
              </span>
              <div className="space-y-2">
                <Input
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Project Title (e.g. Distributed Microservices Engine)"
                  className="bg-[#141824] border-white/10 text-xs text-white"
                />
                <Textarea
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief description of architecture, problem addressed, and measurable outcome..."
                  className="bg-[#141824] border-white/10 text-xs text-slate-200"
                />
                <Input
                  value={newProjectSkills}
                  onChange={(e) => setNewProjectSkills(e.target.value)}
                  placeholder="Technologies Used (comma-separated, e.g. React, Node.js, SQL, Docker)"
                  className="bg-[#141824] border-white/10 text-xs text-white"
                />
              </div>
              <Button onClick={handleAddProject} size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> Save Project
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Floating Save Bar */}
        <div className="sticky bottom-4 z-20 rounded-2xl bg-[#141824]/95 border border-purple-500/40 p-4 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{fullName || 'Student Candidate'}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                {completeness === 100 ? '✅ 100% Calibrated' : `${completeness}% Completed • Calibration in progress`}
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleSaveProfile()}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-bold gap-2 px-6 py-2.5 shadow-lg shadow-purple-900/40 card-hover-lift"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving...' : 'Save & Calibrate Profile'}</span>
          </Button>
        </div>

      </div>

      {/* POPUP NOTIFICATION MODAL: Profile Completed Successfully */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#19142b] to-[#0f1322] border border-purple-500/40 p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-purple-950/60 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Celebratory Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/40">
              <PartyPopper className="h-8 w-8 text-yellow-300 animate-bounce" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-3 py-0.5">
                PROFILE STATUS: 100% COMPLETED
              </Badge>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Profile Completed Successfully!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Congratulations, <strong className="text-white">{fullName}</strong>! Your student identity, verified links (LinkedIn &amp; GitHub), and skill parameters are now fully calibrated in the Cyclops Engine.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/10 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Check className="h-4 w-4" />
                <span>Skill Digital Twin Activated</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Check className="h-4 w-4" />
                <span>AI Resume Studio Grounded with Real Profile</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Check className="h-4 w-4" />
                <span>Recruiter Search &amp; Candidate Matching Active</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link href="/student/resume">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-bold gap-2 py-3 shadow-lg shadow-purple-900/40">
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Resume with New Profile</span>
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link href="/student/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full border-white/10 text-slate-300 text-xs hover:bg-white/5">
                    Back to Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  variant="ghost"
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
