import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-slate-700/80 p-0.5 overflow-hidden">
                <img src="/cyclops-icon.png" alt="Cyclops" className="h-full w-full object-contain rounded-full" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                Cyclops <span className="text-blue-400 font-mono text-[10px]">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An intelligent platform connecting learners, institutions, faculty, and industry through skill intelligence, career pathways, and verified capabilities.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Enterprise Grade Security & Verified Telemetry</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="#skills" className="hover:text-emerald-400 transition-colors">Skill Intelligence</Link></li>
              <li><Link href="#readiness" className="hover:text-emerald-400 transition-colors">Career Readiness</Link></li>
              <li><Link href="#matching" className="hover:text-emerald-400 transition-colors">Opportunity Matching</Link></li>
              <li><Link href="#copilot" className="hover:text-emerald-400 transition-colors">AI Career Copilot</Link></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem Roles */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Ecosystem
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">For Students</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">For Recruiters</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">For Faculty</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">For Institutions</Link></li>
            </ul>
          </div>

          {/* Col 4: Resources & Trust */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Security Controls</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-4">
          <p>© 2026 Cyclops. National Skill Intelligence Infrastructure.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="#" className="hover:text-slate-300">Privacy</Link>
            <Link href="#" className="hover:text-slate-300">Terms</Link>
            <Link href="#" className="hover:text-slate-300">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
