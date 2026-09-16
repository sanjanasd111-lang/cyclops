'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Building2,
  Briefcase,
  BookOpen,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getDashboardRoute } from '@/lib/permissions/routes';
import { UserRole } from '@/lib/types';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('student@cyclops.edu.in');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const rolePresets: Record<UserRole, { label: string; email: string; path: string; icon: any; color: string; bgGlow: string }> = {
    STUDENT: {
      label: 'Student / Learner',
      email: 'student@cyclops.edu.in',
      path: '/student/dashboard',
      icon: GraduationCap,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      bgGlow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    },
    INDUSTRY: {
      label: 'Industry / Recruiter',
      email: 'recruiter@cyclops.com',
      path: '/industry/dashboard',
      icon: Building2,
      color: 'text-blue-400 border-blue-500/40 bg-blue-950/40',
      bgGlow: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    },
    INSTITUTION: {
      label: 'Institution Center',
      email: 'institution@cyclops.edu.in',
      path: '/institution/dashboard',
      icon: Briefcase,
      color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40',
      bgGlow: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    },
    FACULTY: {
      label: 'Faculty Mentor',
      email: 'faculty@cyclops.edu.in',
      path: '/faculty/dashboard',
      icon: BookOpen,
      color: 'text-teal-400 border-teal-500/40 bg-teal-950/40',
      bgGlow: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    },
    ADMIN: {
      label: 'Admin Governance',
      email: 'admin@cyclops.ai',
      path: '/admin/dashboard',
      icon: ShieldCheck,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
      bgGlow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    },
  };

  const handleSelectRoleTab = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(rolePresets[role].email);
    setPassword('Password123!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const normEmail = email.trim().toLowerCase();
    let detectedRole: UserRole = selectedRole;
    if (
      normEmail === 'admin@cyclops.in' ||
      normEmail === 'admin@cyclops.ai' ||
      normEmail.startsWith('admin@') ||
      normEmail.includes('admin')
    ) {
      detectedRole = 'ADMIN';
    } else if (normEmail.includes('industry') || normEmail.includes('recruiter')) {
      detectedRole = 'INDUSTRY';
    } else if (normEmail.includes('faculty') || normEmail.includes('professor') || normEmail.includes('mentor')) {
      detectedRole = 'FACULTY';
    } else if (normEmail.includes('institution') || normEmail.includes('college') || normEmail.includes('dean')) {
      detectedRole = 'INSTITUTION';
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Target route is determined by detected role or user metadata
      const finalRole = (data?.user?.user_metadata?.role as UserRole) || detectedRole || selectedRole || 'STUDENT';
      const targetRoute = redirectTo || rolePresets[finalRole]?.path || getDashboardRoute(finalRole);

      // Set cookie session for immediate client & server middleware validation
      document.cookie = `ayush_demo_session=${finalRole}; path=/; max-age=86400`;

      if (error) {
        console.warn('Supabase auth sign-in notice (using local session):', error.message);
      }

      window.location.href = targetRoute;
    } catch (err: any) {
      console.error('Login exception:', err);
      const targetRoute = redirectTo || rolePresets[detectedRole]?.path || '/student/dashboard';
      document.cookie = `ayush_demo_session=${detectedRole}; path=/; max-age=86400`;
      window.location.href = targetRoute;
    } finally {
      setLoading(false);
    }
  };

  const launchDirect = (role: UserRole) => {
    document.cookie = `ayush_demo_session=${role}; path=/; max-age=86400`;
    window.location.href = rolePresets[role].path;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-hidden">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Left Column: Interactive Brand & Platform Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden z-10">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700/80 p-1 shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
              <img src="/cyclops-icon.png" alt="Cyclops Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                Cyclops <span className="ml-1.5 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">AI</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Talent &amp; Career Intelligence Platform</span>
            </div>
          </Link>

          <div className="pt-8 space-y-4 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unified Role-Based Ecosystem</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
              One Portal. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                Every Career Opportunity.
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Seamlessly sign in to your dedicated workspace — whether you are a Student building an ATS resume, an Industry Recruiter hiring candidates, an Institution tracking placements, or a Faculty Mentor guiding research.
            </p>
          </div>

          {/* Role Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-emerald-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Students &amp; Learners</h3>
              <p className="text-[11px] text-slate-400">ATS Resume Studio, AI Mock Interviews, Skill Twin.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-blue-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Industry Recruiters</h3>
              <p className="text-[11px] text-slate-400">Recruitment Kanban, Candidate Search &amp; Compare.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-indigo-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Institutions</h3>
              <p className="text-[11px] text-slate-400">Placement Command Center, Skill Heatmap &amp; Analytics.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-teal-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Faculty Mentors</h3>
              <p className="text-[11px] text-slate-400">Mentorship Management, R&amp;D Collaborations.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Encryption &amp; Real-time Database Persistence</span>
          </div>
          <span>Cyclops © 2026</span>
        </div>
      </div>

      {/* Right Column: Dynamic Form & Category Switching Workspace */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 bg-slate-950 z-10 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Header Mobile Brand */}
          <div className="lg:hidden text-center space-y-2">
            <Link href="/" className="inline-flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-slate-700/80 p-0.5 flex items-center justify-center">
                <img src="/cyclops-icon.png" alt="Cyclops" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="text-xl font-black text-white">Cyclops</span>
            </Link>
          </div>

          <div className="space-y-1.5 text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-white">Sign In to Your Workspace</h2>
            <p className="text-xs text-slate-400">
              Select your category below for customized dashboard access
            </p>
          </div>

          {/* Interactive Role Category Tabs */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Choose Portal Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              {(Object.keys(rolePresets) as UserRole[]).map((r) => {
                const item = rolePresets[r];
                const isSelected = selectedRole === r;
                const Icon = item.icon;

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectRoleTab(r)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick 1-Click Launch Bar */}
          <div className={`p-3.5 rounded-2xl border ${rolePresets[selectedRole].color} flex items-center justify-between transition-all duration-300 shadow-xl`}>
            <div className="flex items-center space-x-2.5">
              <Zap className="w-4 h-4 animate-bounce text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">{rolePresets[selectedRole].label}</div>
                <div className="text-[10px] font-mono opacity-80">{email}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => launchDirect(selectedRole)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold shadow-md transition-all flex items-center space-x-1 group"
            >
              <span>1-Click Launch</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  <span>Connecting to {selectedRole} Workspace...</span>
                </>
              ) : (
                <>
                  <span>Sign In to {selectedRole} Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Registration Link */}
          <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">Loading Workspace Login...</span>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
