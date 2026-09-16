'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Bookmark,
  FileCheck,
  Brain,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Users,
  ShieldCheck,
  FileText,
  Building2,
  FolderGit2,
} from 'lucide-react';

export default function CollapsibleSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  let menuItems: Array<{ href: string; label: string; icon: any }> = [];

  if (pathname.startsWith('/industry')) {
    menuItems = [
      { href: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/industry/opportunities/create', label: 'Post Opportunity', icon: Briefcase },
      { href: '/industry/recruitment', label: 'Recruitment Kanban', icon: FolderGit2 },
      { href: '/industry/candidates', label: 'Candidate Pool', icon: Users },
      { href: '/industry/candidates/compare', label: 'Candidate Matrix', icon: BarChart3 },
      { href: '/industry/analytics', label: 'Analytics', icon: TrendingUp },
    ];
  } else if (pathname.startsWith('/institution')) {
    menuItems = [
      { href: '/institution/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/institution/placements', label: 'Placement Command', icon: BarChart3 },
      { href: '/institution/skill-intelligence', label: 'Skill Intelligence', icon: TrendingUp },
      { href: '/institution/ai-placement', label: 'AI Strategist', icon: Brain },
      { href: '/institution/students', label: 'Student Directory', icon: Users },
    ];
  } else if (pathname.startsWith('/admin')) {
    menuItems = [
      { href: '/admin/dashboard', label: 'Command Center', icon: LayoutDashboard },
      { href: '/admin/users', label: 'User Governance', icon: Users },
      { href: '/admin/verification', label: 'Verifications', icon: ShieldCheck },
      { href: '/admin/audit', label: 'Audit Logs', icon: FileText },
    ];
  } else {
    menuItems = [
      { href: '/student/dashboard', label: 'Career Hub', icon: LayoutDashboard },
      { href: '/student/jobs', label: 'Jobs Search', icon: Briefcase },
      { href: '/student/internships', label: 'Internships', icon: BookOpen },
      { href: '/student/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
      { href: '/student/applications', label: 'Applications', icon: FileCheck },
      { href: '/student/interview', label: 'AI Simulator', icon: Brain },
      { href: '/student/assessment', label: 'Skill Assessment', icon: Award },
      { href: '/student/copilot', label: 'Career Copilot', icon: Sparkles },
    ];
  }

  return (
    <aside
      className={`hidden md:flex flex-col bg-slate-950/90 border-r border-slate-800/80 transition-all duration-300 min-h-[calc(100vh-4rem)] ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Collapse Toggle Header */}
      <div className="p-3 flex items-center justify-between border-b border-slate-800/60">
        {!collapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Navigation</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/40 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
