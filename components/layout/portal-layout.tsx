"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  GraduationCap,
  Target,
  Compass,
  Briefcase,
  BookOpen,
  Award,
  UserCheck,
  Building2,
  ShieldCheck,
  FileText,
  Bot,
  Bell,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Grid,
  FileSpreadsheet,
  Users,
  BrainCircuit,
  Lightbulb,
  Award as IconAward,
  BookMarked,
  Search,
  Check,
  User,
  Calendar,
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import { CommandPalette } from '@/components/navigation/command-palette';
import { createClient } from '@/lib/supabase/client';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface PortalLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userTitle?: string;
  userName?: string;
  userSubtitle?: string;
}

export function PortalLayout({
  children,
  role,
  userTitle,
  userName,
  userSubtitle
}: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifsRef = useRef<HTMLDivElement>(null);

  const [profileName, setProfileName] = useState<string>(userTitle || 'Complete your profile');
  const [profileSubtitle, setProfileSubtitle] = useState<string>(userSubtitle || 'Academic Workspace');

  useEffect(() => {
    if (!userTitle) {
      fetch('/api/student/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.profile) {
            const p = data.data.profile;
            if (p.full_name) setProfileName(p.full_name);
            else setProfileName('Complete your profile');

            if (p.department || p.course) setProfileSubtitle(p.department || p.course);
          }
        })
        .catch(() => {});
    }

    loadActiveNotifications();
  }, [userTitle]);

  const loadActiveNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          let readIds = new Set<string>();
          try {
            const stored = localStorage.getItem('ruas_read_notification_ids');
            if (stored) JSON.parse(stored).forEach((id: string) => readIds.add(id));
          } catch {}
          const updated = data.data.map((n: any) => ({
            ...n,
            is_read: n.is_read || readIds.has(n.id),
          }));
          setNotifications(updated);
        }
      })
      .catch(() => {});
  };

  // Listen to cross-component notification updates
  useEffect(() => {
    window.addEventListener('ruas-notifications-updated', loadActiveNotifications);
    return () => window.removeEventListener('ruas-notifications-updated', loadActiveNotifications);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setNotifsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      document.cookie = 'ayush_demo_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    } finally {
      window.location.href = '/login';
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      try {
        const stored = localStorage.getItem('ruas_read_notification_ids');
        const readIds = stored ? JSON.parse(stored) : [];
        if (!readIds.includes(id)) {
          readIds.push(id);
          localStorage.setItem('ruas_read_notification_ids', JSON.stringify(readIds));
        }
      } catch {}

      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      window.dispatchEvent(new CustomEvent('ruas-notifications-updated'));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.is_read).length;

  const studentItems: SidebarItem[] = [
    { label: 'Overview', href: '/student/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'My Profile & Links', href: '/student/profile', icon: <User className="h-4 w-4" />, badge: 'Edit' },
    { label: 'AI Career Copilot', href: '/student/copilot', icon: <Bot className="h-4 w-4" />, badge: 'AI' },
    { label: 'Career Readiness', href: '/student/readiness', icon: <TrendingUp className="h-4 w-4" />, badge: 'Score' },
    { label: 'AI Resume Studio', href: '/student/resume', icon: <Sparkles className="h-4 w-4" />, badge: 'AI' },
    { label: 'AI Interview Prep', href: '/student/interview', icon: <BrainCircuit className="h-4 w-4" />, badge: 'AI' },
    { label: 'Interview Calendar', href: '/student/calendar', icon: <Calendar className="h-4 w-4" />, badge: 'Slots' },
    { label: 'Opportunities Feed', href: '/student/opportunities', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Application Tracker', href: '/student/applications', icon: <FileText className="h-4 w-4" /> },
    { label: 'Skill Assessment', href: '/student/assessment', icon: <Target className="h-4 w-4" /> },
    { label: 'Skill Gap Matrix', href: '/student/skill-gap', icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: '30-60-90 Roadmap', href: '/student/roadmap', icon: <Compass className="h-4 w-4" /> },
    { label: 'Digital Passport', href: '/student/portfolio', icon: <Award className="h-4 w-4" /> },
    { label: 'Notifications', href: '/student/notifications', icon: <Bell className="h-4 w-4" />, badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : undefined },
  ];

  const industryItems: SidebarItem[] = [
    { label: 'Recruiter Console', href: '/industry/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Create Opportunity', href: '/industry/opportunities/create', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Active Opportunities', href: '/industry/opportunities', icon: <FileText className="h-4 w-4" /> },
    { label: 'Candidate Discovery', href: '/industry/candidates', icon: <UserCheck className="h-4 w-4" /> },
    { label: 'Recruitment Pipeline', href: '/industry/recruitment', icon: <Target className="h-4 w-4" /> },
    { label: 'Interview Schedule', href: '/industry/interviews', icon: <GraduationCap className="h-4 w-4" /> },
    { label: 'Industry AI Assistant', href: '/industry/ai', icon: <Bot className="h-4 w-4" />, badge: 'AI' },
    { label: 'Skill Demand Analytics', href: '/industry/analytics', icon: <Building2 className="h-4 w-4" /> },
    { label: 'Collaboration Hub', href: '/industry/collaborations', icon: <BookOpen className="h-4 w-4" /> },
  ];

  const facultyItems: SidebarItem[] = [
    { label: 'Faculty Workstation', href: '/faculty/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Faculty Profile', href: '/faculty/profile', icon: <UserCheck className="h-4 w-4" /> },
    { label: 'Authorized Mentees', href: '/faculty/students', icon: <Users className="h-4 w-4" /> },
    { label: 'Mentorship Program', href: '/faculty/mentorship', icon: <GraduationCap className="h-4 w-4" /> },
    { label: 'Research Projects', href: '/faculty/research', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Industrial Training', href: '/faculty/industrial-training', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Workshops Console', href: '/faculty/workshops', icon: <Target className="h-4 w-4" /> },
    { label: 'Industry Collaborations', href: '/faculty/collaborations', icon: <Building2 className="h-4 w-4" /> },
    { label: 'Cohort Analytics', href: '/faculty/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Faculty AI Copilot', href: '/faculty/ai', icon: <BrainCircuit className="h-4 w-4" />, badge: 'AI' },
  ];

  const institutionItems: SidebarItem[] = [
    { label: 'Executive Dashboard', href: '/institution/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Placement Command Center', href: '/institution/placements', icon: <Briefcase className="h-4 w-4" />, badge: 'INTEL' },
    { label: 'AI Placement Strategist', href: '/institution/ai-placement', icon: <Bot className="h-4 w-4" />, badge: 'AI' },
    { label: 'Skill Intelligence & Heatmap', href: '/institution/skill-intelligence', icon: <Target className="h-4 w-4" /> },
    { label: 'Student Directory', href: '/institution/students', icon: <Users className="h-4 w-4" /> },
    { label: 'Skill Demand Analytics', href: '/institution/skill-demand', icon: <TrendingUp className="h-4 w-4" /> },
    { label: 'Skill Gap Matrix', href: '/institution/skill-gap', icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: 'Branch Skill Heatmap', href: '/institution/analytics', icon: <Grid className="h-4 w-4" /> },
    { label: 'Internship Intelligence', href: '/institution/internships', icon: <BookMarked className="h-4 w-4" /> },
    { label: 'Industry Partners', href: '/institution/industry', icon: <UserCheck className="h-4 w-4" /> },
    { label: 'Collaboration Hub', href: '/institution/collaborations', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Curriculum Intelligence', href: '/institution/curriculum', icon: <Lightbulb className="h-4 w-4" />, badge: 'NEW' },
    { label: 'Institutional Reports', href: '/institution/reports', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { label: 'Institution AI Assistant', href: '/institution/ai', icon: <Bot className="h-4 w-4" />, badge: 'AI' },
  ];

  const adminItems: SidebarItem[] = [
    { label: 'System Console', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'User Governance', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
    { label: 'Organization Verification', href: '/admin/verification', icon: <ShieldCheck className="h-4 w-4" />, badge: 'GOV' },
    { label: 'Opportunity Moderation', href: '/admin/opportunities', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Governance Reports', href: '/admin/reports', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { label: 'Security Audit Trail', href: '/admin/audit', icon: <FileText className="h-4 w-4" /> },
    { label: 'Platform Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'System Health Monitor', href: '/admin/system-health', icon: <CheckCircle2 className="h-4 w-4" />, badge: 'LIVE' },
    { label: 'AI Usage & Safety', href: '/admin/ai-usage', icon: <BrainCircuit className="h-4 w-4" />, badge: 'AI' },
  ];

  const navItemsMap: Record<UserRole, SidebarItem[]> = {
    STUDENT: studentItems,
    INDUSTRY: industryItems,
    FACULTY: facultyItems,
    INSTITUTION: institutionItems,
    ADMIN: adminItems,
  };

  const currentNavItems = navItemsMap[role] || studentItems;
  const displayName = userTitle || profileName;
  const displaySubtitle = userSubtitle || profileSubtitle;

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col font-sans selection:bg-purple-500/20 selection:text-purple-300">
      
      {/* Top Header Bar (Photo 2 Sleek Floating Header) */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-white/5 bg-[#101320]/90 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151926] border border-white/10 p-0.5 overflow-hidden shadow-md shadow-purple-950/40">
              <img src="/cyclops-icon.png" alt="Cyclops" className="h-full w-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
                Cyclops <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">CRM</span>
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-purple-950/40 border border-purple-500/30 text-purple-300">
            {role} WORKSPACE
          </span>

          {/* Quick Command Palette Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#141824] border border-white/5 text-slate-400 hover:text-slate-200 text-xs transition-colors ml-2"
          >
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span>Search or jump to...</span>
            <kbd className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] font-mono text-slate-400 border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* User Profile & Actions Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Trigger & Dropdown */}
          <div className="relative" ref={notifsRef}>
            <button
              onClick={() => setNotifsOpen(!notifsOpen)}
              className="relative p-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink-500 animate-pulse shadow-sm shadow-pink-500/50" />
              )}
            </button>

            {/* Notification Popover Drawer */}
            {notifsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#151926] border border-white/10 shadow-2xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-pink-400" /> Notifications
                  </span>
                  {unreadNotifsCount > 0 && (
                    <span className="text-[10px] font-mono bg-pink-950 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">
                      {unreadNotifsCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 transition-colors ${
                          n.is_read ? 'border-white/5 bg-[#101320]/60' : 'border-purple-500/30 bg-[#121524]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white truncate">{n.title}</span>
                          {!n.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(n.id)}
                              className="text-[10px] text-pink-400 hover:underline"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-1 border-t border-white/5 text-center">
                  <Link
                    href="/student/notifications"
                    onClick={() => setNotifsOpen(false)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <Link
            href={role === 'STUDENT' ? '/student/profile' : `/${role.toLowerCase()}/profile`}
            className="flex items-center gap-2.5 pl-2 border-l border-white/5 hover:opacity-85 transition-opacity group"
            title="Edit Profile & Links"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-bold text-xs shrink-0 shadow-md shadow-purple-950/50 group-hover:ring-2 group-hover:ring-purple-500/50 transition-all">
              {displayName.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col text-left max-w-[130px]">
              <span className="text-xs font-semibold text-slate-200 leading-tight truncate group-hover:text-purple-300 transition-colors">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate">
                {displaySubtitle}
              </span>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1">
        
        {/* Sidebar Navigation (Direct Photo 2 Layout) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0d101a] border-r border-white/5 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto shrink-0 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 lg:hidden border-b border-white/5">
              <span className="font-bold text-slate-200 text-xs">CRM Navigation</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Section Header */}
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {role} DASHBOARD
              </div>

              {currentNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'border-l-4 border-purple-500 bg-purple-600/20 text-white font-semibold rounded-r-xl shadow-sm'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white rounded-xl'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-purple-300' : 'text-slate-400 group-hover:text-slate-200'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-purple-950/60 border border-purple-500/30 text-purple-300">
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom Action Pill Button (Photo 2 Bottom Download/Export Pill) */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <Link
              href={role === 'STUDENT' ? '/student/resume/report' : '/student/dashboard'}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all card-hover-lift"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Report</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-pink-400 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Workspace View */}
        <main className="flex-1 bg-[#0a0d16] p-4 sm:p-6 lg:p-8 overflow-x-hidden max-w-full">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

    </div>
  );
}
