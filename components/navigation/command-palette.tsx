'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  Briefcase,
  Sparkles,
  BrainCircuit,
  Award,
  Target,
  FileText,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  ArrowRight,
  X,
  Bot,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Student' | 'Industry' | 'Institution' | 'Admin' | 'General';
  href: string;
  icon: any;
  keywords?: string[];
}

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Student Commands
    { id: 'c-std-dash', title: 'Student Career Dashboard', category: 'Student', href: '/student/dashboard', icon: LayoutDashboard, keywords: ['overview', 'home', 'readiness'] },
    { id: 'c-std-opps', title: 'Find Opportunities & Jobs', category: 'Student', href: '/student/opportunities', icon: Briefcase, keywords: ['internships', 'jobs', 'apply'] },
    { id: 'c-std-copilot', title: 'AI Career Copilot', category: 'Student', href: '/student/copilot', icon: Bot, keywords: ['assistant', 'chat', 'guidance'] },
    { id: 'c-std-resume', title: 'AI Resume Studio & ATS', category: 'Student', href: '/student/resume', icon: Sparkles, keywords: ['builder', 'ats', 'cv'] },
    { id: 'c-std-interview', title: 'AI Mock Interview Simulator', category: 'Student', href: '/student/interview', icon: BrainCircuit, keywords: ['prep', 'practice', 'voice'] },
    { id: 'c-std-skills', title: 'Digital Skill Passport', category: 'Student', href: '/student/skills', icon: Award, keywords: ['verified', 'credentials', 'badges'] },
    { id: 'c-std-gap', title: 'Skill Gap & Deficit Matrix', category: 'Student', href: '/student/skill-gap', icon: Target, keywords: ['gaps', 'deficits', 'threshold'] },
    { id: 'c-std-roadmap', title: '30-60-90 Day Career Roadmap', category: 'Student', href: '/student/roadmap', icon: Compass, keywords: ['plan', 'milestones', 'learning'] },
    { id: 'c-std-apps', title: 'Application Tracker', category: 'Student', href: '/student/applications', icon: FileText, keywords: ['status', 'applied', 'history'] },
    { id: 'c-std-portfolio', title: 'Public Digital Portfolio & QR', category: 'Student', href: '/student/portfolio', icon: Award, keywords: ['share', 'qr', 'portfolio'] },

    // Industry Commands
    { id: 'c-ind-dash', title: 'Recruiter Dashboard', category: 'Industry', href: '/industry/dashboard', icon: LayoutDashboard, keywords: ['recruiter', 'hiring'] },
    { id: 'c-ind-pipeline', title: 'Recruitment Kanban Pipeline', category: 'Industry', href: '/industry/recruitment', icon: Target, keywords: ['kanban', 'shortlist', 'candidates'] },
    { id: 'c-ind-create', title: 'Post New Opportunity', category: 'Industry', href: '/industry/opportunities/create', icon: Briefcase, keywords: ['new job', 'hire'] },
    { id: 'c-ind-candidates', title: 'Discover Verified Candidates', category: 'Industry', href: '/industry/candidates', icon: Users, keywords: ['talent', 'search', 'match'] },

    // Institution Commands
    { id: 'c-inst-dash', title: 'Executive Placement Dashboard', category: 'Institution', href: '/institution/dashboard', icon: LayoutDashboard, keywords: ['college', 'placement'] },
    { id: 'c-inst-command', title: 'Placement Command Center', category: 'Institution', href: '/institution/placements', icon: Briefcase, keywords: ['funnel', 'cohorts', 'demand'] },
    { id: 'c-inst-skills', title: 'Skill Intelligence & Heatmap', category: 'Institution', href: '/institution/skill-intelligence', icon: Target, keywords: ['heatmap', 'demand', 'supply'] },
    { id: 'c-inst-ai', title: 'AI Placement Strategist', category: 'Institution', href: '/institution/ai-placement', icon: Bot, keywords: ['insights', 'strategy', 'drives'] },

    // Admin Commands
    { id: 'c-adm-dash', title: 'System Governance Console', category: 'Admin', href: '/admin/dashboard', icon: ShieldCheck, keywords: ['admin', 'governance'] },
    { id: 'c-adm-users', title: 'User Account Governance', category: 'Admin', href: '/admin/users', icon: Users, keywords: ['accounts', 'suspend', 'roles'] },
    { id: 'c-adm-verif', title: 'Organization Verification Hub', category: 'Admin', href: '/admin/verification', icon: ShieldCheck, keywords: ['badges', 'approve', 'verify'] },
    { id: 'c-adm-mod', title: 'Opportunity Moderation', category: 'Admin', href: '/admin/opportunities', icon: Briefcase, keywords: ['signals', 'moderation', 'quality'] },
    { id: 'c-adm-health', title: 'System Health Diagnostics', category: 'Admin', href: '/admin/system-health', icon: BrainCircuit, keywords: ['latency', 'uptime', 'database'] },
  ];

  const filtered = commands.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.keywords && c.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If we want to open from shortcut, this will be handled by global listener
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          router.push(filtered[selectedIndex].href);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filtered, selectedIndex, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <Search className="h-4 w-4 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, page name, or resource... (e.g. Resume, Kanban, Verif)"
            className="w-full bg-transparent text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSel = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    router.push(cmd.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                    isSel ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isSel ? 'text-white' : 'text-emerald-400'}`} />
                    <span>{cmd.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      isSel ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {cmd.category}
                    </span>
                    <ArrowRight className={`h-3 w-3 ${isSel ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Use ↑ ↓ to navigate</span>
          <span>Press ↵ Enter to select</span>
        </div>
      </div>
    </div>
  );
}
