'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/lib/types';
import { getDashboardRoute } from '@/lib/permissions/routes';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Category Specific Fields
  const [academicStream, setAcademicStream] = useState('Computer Science & Engineering');
  const [targetGoal, setTargetGoal] = useState('Software Engineer');
  const [organizationName, setOrganizationName] = useState('Ramaiah University of Applied Sciences');
  const [departmentName, setDepartmentName] = useState('Department of Computer Science & Technology');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roleOptions: Array<{ role: UserRole; title: string; desc: string; icon: any; glow: string; border: string }> = [
    {
      role: 'STUDENT',
      title: 'Student / Learner',
      desc: 'Build your skill twin, ATS resume, practice AI mock interviews & explore opportunities',
      icon: GraduationCap,
      glow: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500',
    },
    {
      role: 'INDUSTRY',
      title: 'Industry / Recruiter',
      desc: 'Post verified opportunities, access ranked candidate pools & manage recruitment Kanban',
      icon: Building2,
      glow: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500',
    },
    {
      role: 'INSTITUTION',
      title: 'Institution Admin',
      desc: 'Access placement command center, skill heatmaps, supply vs demand & AI strategist',
      icon: Briefcase,
      glow: 'from-indigo-500/20 to-purple-500/10',
      border: 'border-indigo-500',
    },
    {
      role: 'FACULTY',
      title: 'Faculty / Mentor',
      desc: 'Guide student mentorship, co-develop research projects & industrial trainings',
      icon: BookOpen,
      glow: 'from-teal-500/20 to-emerald-500/10',
      border: 'border-teal-500',
    },
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Register with Supabase Auth
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
            academic_stream: selectedRole === 'STUDENT' ? academicStream : undefined,
            career_goal: selectedRole === 'STUDENT' ? targetGoal : undefined,
            organization_name: organizationName,
          },
        },
      });

      if (error) {
        console.warn('Supabase signUp notice (using local dev session):', error.message);
      }

      // 2. Persist real-time student/role profile in database
      if (selectedRole === 'STUDENT') {
        try {
          await fetch('/api/student/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              profile: {
                full_name: fullName,
                academic_stream: academicStream,
                department: academicStream,
                target_role: targetGoal,
                career_goal: targetGoal,
                institution_name: organizationName,
                profile_completed: true,
              },
            }),
          });
        } catch {}
      }

      // 3. Issue session cookie and navigate directly to the chosen role dashboard
      document.cookie = `ayush_demo_session=${selectedRole}; path=/; max-age=86400`;
      const targetDashboard = getDashboardRoute(selectedRole);
      window.location.href = targetDashboard;
    } catch (err: any) {
      console.error('Registration exception:', err);
      document.cookie = `ayush_demo_session=${selectedRole}; path=/; max-age=86400`;
      const targetDashboard = getDashboardRoute(selectedRole);
      window.location.href = targetDashboard;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-hidden">
      {/* Animated Glowing Halos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700/80 p-1 shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img src="/cyclops-icon.png" alt="Cyclops Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-2xl font-black text-white">
              Cyclops <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Create your account on India&apos;s Grounded Career &amp; Talent Intelligence Ecosystem
          </p>
        </div>

        {/* STEP 1: CATEGORY / ROLE SELECTION CARDS */}
        {step === 1 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-md">
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 1 of 2: Select Category</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">What best describes your role?</h2>
              <p className="text-xs text-slate-400">Your choice unlocks tailored workflows, toolsets, and dedicated intelligence dashboards</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {roleOptions.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;

                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 space-y-3 relative group ${
                      isSelected
                        ? `bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 ${item.border} text-white shadow-xl shadow-emerald-500/10 scale-[1.02]`
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isSelected ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{item.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Continue Registration as {selectedRole}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* STEP 2: DETAILS & CATEGORY PROFILE FORM */}
        {step === 2 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <Zap className="w-3 h-3 mr-1" />
                  <span>Configuring {selectedRole} Account</span>
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">Enter Registration Details</h2>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Change Role
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Official / Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditi@cyclops.edu.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Dynamic Category Profile Fields */}
              {selectedRole === 'STUDENT' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">Academic Branch</label>
                    <select
                      value={academicStream}
                      onChange={(e) => setAcademicStream(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Ayurvedic Medicine & Surgery (BAMS)">Ayurvedic Medicine (BAMS)</option>
                      <option value="Pharmacy & Pharmaceutical Sciences">Pharmacy & Pharmacology</option>
                      <option value="Management & MBA">Management & MBA</option>
                      <option value="Commerce & Finance">Commerce & Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">Target Career Goal</label>
                    <input
                      type="text"
                      required
                      value={targetGoal}
                      onChange={(e) => setTargetGoal(e.target.value)}
                      placeholder="e.g. Clinical Research Specialist"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {(selectedRole === 'INDUSTRY' || selectedRole === 'INSTITUTION' || selectedRole === 'FACULTY') && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">
                      {selectedRole === 'INDUSTRY' ? 'Organization / Company Name' : 'College / University Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Tata Motors / Ramaiah University"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <Brain className="w-4 h-4 animate-pulse" />
                    <span>Configuring {selectedRole} Workspace &amp; Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration &amp; Open {selectedRole} Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            Sign In to Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}

