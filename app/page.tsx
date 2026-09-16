'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Brain,
  GraduationCap,
  Award,
  Briefcase,
  Target,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Users,
  Search,
  ChevronRight,
  FileCheck,
  Video,
  Layers,
  Cpu,
  Compass,
  FileText,
  CheckCircle2,
  Building2,
  ShieldCheck,
  BookOpen,
  Zap,
  Activity,
  Check,
  Code,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import GlobalNavbar from '@/components/navigation/navbar';
import InteractiveTileGrid from '@/components/landing/InteractiveTileGrid';
import IsometricGraphic from '@/components/landing/IsometricGraphic';

export default function LandingPage() {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  const roleProfiles = [
    {
      tabLabel: '🌿 Ayurveda & AYUSH',
      targetRole: 'Clinical Research Associate',
      domain: 'Ayurveda & AYUSH / Biotech',
      readiness: 88,
      pathway: ['Clinical Research', 'Biostatistics Micro-Course', 'Research Internship'],
      skills: [
        { name: 'Clinical Research & Trials', level: 92, gap: 8 },
        { name: 'Ayurvedic Pharmacognosy', level: 96, gap: 4 },
        { name: 'Research Methodology', level: 85, gap: 15 },
        { name: 'Biostatistics & Data Analysis', level: 68, gap: 32 },
      ],
    },
    {
      tabLabel: '💻 Computer Science',
      targetRole: 'Full Stack Software Engineer',
      domain: 'Computer Science & IT',
      readiness: 94,
      pathway: ['TypeScript & Next.js', 'System Architecture', 'Production Internship'],
      skills: [
        { name: 'Next.js & React 18', level: 95, gap: 5 },
        { name: 'TypeScript & Node.js', level: 92, gap: 8 },
        { name: 'Database & Supabase RLS', level: 88, gap: 12 },
        { name: 'Distributed System Design', level: 80, gap: 20 },
      ],
    },
    {
      tabLabel: '🤖 AI & Data Science',
      targetRole: 'AI & Data Science Analyst',
      domain: 'Data Science & AI',
      readiness: 91,
      pathway: ['PyTorch & Deep Learning', 'GenAI Prompt Engineering', 'Industry Data Project'],
      skills: [
        { name: 'Python & PyTorch', level: 94, gap: 6 },
        { name: 'Machine Learning Pipelines', level: 90, gap: 10 },
        { name: 'Data Visualization & Insights', level: 86, gap: 14 },
        { name: 'LLM Fine-Tuning & RAG', level: 82, gap: 18 },
      ],
    },
    {
      tabLabel: '🧬 Biotech & Pharma',
      targetRole: 'Bioprocess Quality Scientist',
      domain: 'Pharmacy & Biotechnology',
      readiness: 86,
      pathway: ['Bioprocess Validation', 'GMP Compliance', 'Pharma Lab Attachment'],
      skills: [
        { name: 'Bioprocess Validation', level: 88, gap: 12 },
        { name: 'GMP & Regulatory Standards', level: 92, gap: 8 },
        { name: 'Chromatography (HPLC/GC)', level: 82, gap: 18 },
        { name: 'Microbial Quality Control', level: 78, gap: 22 },
      ],
    },
    {
      tabLabel: '⚙️ Core Engineering',
      targetRole: 'Robotics & Automation Engineer',
      domain: 'Mechanical & Core Engineering',
      readiness: 84,
      pathway: ['ROS & Sensor Fusion', 'Embedded C/C++', 'Smart Factory Internship'],
      skills: [
        { name: 'Robotics Operating System (ROS)', level: 85, gap: 15 },
        { name: 'Kinematics & Sensor Fusion', level: 82, gap: 18 },
        { name: 'Embedded C/C++ Control', level: 90, gap: 10 },
        { name: 'PLC & SCADA Automation', level: 74, gap: 26 },
      ],
    },
  ];

  const currentProfile = roleProfiles[selectedRoleIndex];

  const placementTickerItems = [
    { name: 'Dr. Sneha M.', branch: 'Ayurveda & AYUSH', company: 'Himalaya Wellness', package: '₹8.5 LPA', tag: 'Placement' },
    { name: 'Aditya Verma', branch: 'Computer Science', company: 'Microsoft IDC', package: '₹22.0 LPA', tag: 'Placement' },
    { name: 'Priya Sharma', branch: 'Biotechnology', company: 'Biocon Biologics', package: '₹10.8 LPA', tag: 'R&D Fellow' },
    { name: 'Karan Patel', branch: 'Mechanical Engineering', company: 'Tata Motors EV', package: '₹9.6 LPA', tag: 'Placement' },
    { name: 'Ananya Sen', branch: 'Data Science & AI', company: 'Tiger Analytics', package: '₹14.2 LPA', tag: 'Placement' },
    { name: 'Dr. Rakesh Nair', branch: 'Ayurvedic Medicine', company: 'Apollo AYUSH', package: '₹11.0 LPA', tag: 'Clinical Lead' },
    { name: 'Vikram Joshi', branch: 'Electronics & Comm.', company: 'Siemens Healthineers', package: '₹12.5 LPA', tag: 'Internship' },
    { name: 'Meera Nambiar', branch: 'Pharmacy', company: 'Dr. Reddy\'s Labs', package: '₹9.0 LPA', tag: 'Placement' },
  ];

  const platformStats = [
    { label: 'Placement Velocity', value: '94.8%', sub: 'Cross-Domain Verification' },
    { label: 'Hallucination Rate', value: '0.08%', sub: 'Deterministic Grounded AI' },
    { label: 'Variance Tolerance', value: '±0.02', sub: 'Industry Standard Calibrated' },
    { label: 'Algorithmic Accuracy', value: '4.9/5', sub: 'Audited by Enterprise Recruiters' },
  ];

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 font-sans selection:bg-purple-500/20 selection:text-purple-300 relative overflow-x-hidden">
      {/* Navigation Header */}
      <GlobalNavbar />

      {/* HERO SECTION WITH INTERACTIVE BACKGROUND TILE GRID (Photo 1 Template) */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-white/5">
        
        {/* Interactive Tile Grid Canvas (Hover over tiles to animate colors and fade back) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto opacity-75">
          <InteractiveTileGrid />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070b]/40 to-[#07070b] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#07070b_85%)] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Status Pill Tag (Photo 1 Style) */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-[#121024]/80 text-xs font-mono font-medium text-purple-300 shadow-lg shadow-purple-950/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>cyclops.ai.connect() • Validated Multi-Branch Skill Intelligence</span>
            </div>

            {/* Massive Bold Headline (Photo 1 Layout) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
              Turn Skills Into Opportunities, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300">
                validated by experts
              </span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              AI-powered career intelligence connecting students, institutions, and industry across all academic branches — from Ayurveda and Healthcare to Computer Science and Core Engineering.
            </p>

            {/* CTA Buttons (Photo 1 Vibrant Purple Primary + Dark Secondary) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-sm shadow-xl shadow-purple-950/60 transition-all flex items-center justify-center space-x-2 group cursor-pointer card-hover-lift ring-1 ring-purple-400/30"
              >
                <span>Start exploring</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#platform"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-sm border border-white/10 transition-all flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <span>Explore Platform</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Visual Pipeline Bar: Student -> Skills -> AI -> Opportunity -> Placement */}
            <div className="p-3 bg-[#0e101a]/90 rounded-2xl border border-white/10 max-w-xl w-full shadow-xl backdrop-blur-md mt-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <GraduationCap className="h-3.5 w-3.5" /> Student
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1 font-bold text-cyan-400">
                  <Award className="h-3.5 w-3.5" /> Skills
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1 font-bold text-purple-400">
                  <Brain className="h-3.5 w-3.5" /> AI
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1 font-bold text-pink-400">
                  <Briefcase className="h-3.5 w-3.5" /> Opportunity
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Target className="h-3.5 w-3.5" /> Placement
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Skill Intelligence Panel (Preserving All Academic Branch Details) */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d101a]/90 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
              
              {/* Branch Tabs Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
                {roleProfiles.map((p, idx) => (
                  <button
                    key={p.targetRole}
                    onClick={() => setSelectedRoleIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedRoleIndex === idx
                        ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400/40'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {p.tabLabel}
                  </button>
                ))}
              </div>

              {/* Target Role & Readiness Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                    {currentProfile.domain}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">{currentProfile.targetRole}</h3>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-0">
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono">
                    {currentProfile.readiness}%
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">CAREER READINESS SCORE</div>
                </div>
              </div>

              {/* Animated Skill Progress Bars */}
              <div className="space-y-4">
                {currentProfile.skills.map((s) => (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">{s.name}</span>
                      <span className={s.gap > 20 ? 'text-pink-400 font-bold' : 'text-cyan-400 font-bold'}>
                        {s.level}% {s.gap > 20 && <span className="text-slate-400 text-[10px] font-medium font-mono">(Deficit: {s.gap}%)</span>}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#141824] border border-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          s.gap > 20
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400'
                        }`}
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Career Pathway Box */}
              <div className="p-4 rounded-2xl bg-[#090b12] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-purple-400 flex items-center space-x-1">
                    <Compass className="w-3.5 h-3.5 mr-1 text-purple-400" />
                    <span>RECOMMENDED REMEDIATION PATHWAY</span>
                  </span>
                  <span className="text-slate-400 font-mono">94% Algorithmic Match</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  {currentProfile.pathway.map((step, idx) => (
                    <React.Fragment key={step}>
                      <span className={idx === currentProfile.pathway.length - 1 ? 'text-pink-400 font-bold' : 'text-slate-300'}>
                        {step}
                      </span>
                      {idx < currentProfile.pathway.length - 1 && (
                        <span className="text-slate-600 font-normal">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* LIVE PLACEMENT TICKER (Continuous Horizontal Marquee) */}
      <section className="bg-[#0b0d16] border-b border-white/5 py-3.5 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div className="shrink-0 flex items-center gap-2 px-3 py-1 bg-purple-950/60 border border-purple-500/30 rounded-full text-purple-300 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>LIVE PLACEMENT TICKER</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="inline-flex gap-6 animate-marquee">
              {placementTickerItems.concat(placementTickerItems).map((item, index) => (
                <div key={index} className="inline-flex items-center gap-2 text-xs text-slate-300 bg-[#121522] px-3.5 py-1.5 rounded-xl border border-white/5 shadow-sm">
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="text-[10px] text-slate-400">({item.branch})</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-bold text-cyan-400">{item.company}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    {item.package}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: EVERY CAPABILITY YOUR INSTITUTION & STUDENTS NEED (Photo 1 Template) */}
      <section className="py-24 border-b border-white/5 bg-[#07070b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Header with Top Right Purple Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                PLATFORM CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Every capability your institution &amp; students need
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                From multi-turn adaptive diagnostics to enterprise recruiter pipelines — validated talent intelligence in any format.
              </p>
            </div>

            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
            >
              <span>Start exploring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid (Photo 1 Left 3D Isometric Stack + Feature Matrix) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature Card 1 with 3D Isometric Stack */}
            <Link
              href="/student/assessment"
              className="p-6 rounded-3xl bg-[#0e101a] border border-white/5 hover:border-purple-500/40 transition-all space-y-4 group flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  Adaptive Skill Diagnostic
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluate core competencies against live market benchmarks with STAR question sampling and deterministic scoring.
                </p>
              </div>

              {/* 3D Isometric Illustration */}
              <div className="py-2 flex justify-center">
                <IsometricGraphic variant="stack" className="w-44 h-32" />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 border-t border-white/5">
                <span>Launch Diagnostic</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature Card 2 with 3D Layers Graphic */}
            <Link
              href="/student/skills/digital-twin"
              className="p-6 rounded-3xl bg-[#0e101a] border border-white/5 hover:border-purple-500/40 transition-all space-y-4 group flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Skill Digital Twin
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live 360-degree digital talent profile reflecting verified credentials, GitHub commits, coursework, and live micro-assessments.
                </p>
              </div>

              {/* 3D Isometric Illustration */}
              <div className="py-2 flex justify-center">
                <IsometricGraphic variant="layers" className="w-44 h-32" />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-cyan-400 pt-2 border-t border-white/5">
                <span>View Digital Twin</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature Card 3 with 3D Steps Graphic */}
            <Link
              href="/student/skill-gap"
              className="p-6 rounded-3xl bg-[#0e101a] border border-white/5 hover:border-purple-500/40 transition-all space-y-4 group flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                  Skill Gap Matrix
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deterministic deficit identification mapped directly to 30-60-90 day remediation roadmaps and micro-credentials.
                </p>
              </div>

              {/* 3D Isometric Illustration */}
              <div className="py-2 flex justify-center">
                <IsometricGraphic variant="steps" className="w-44 h-32" />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-pink-400 pt-2 border-t border-white/5">
                <span>Analyze Skill Gap</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature Card 4 */}
            <Link
              href="/student/resume"
              className="p-6 rounded-3xl bg-[#0e101a] border border-white/5 hover:border-purple-500/40 transition-all space-y-4 group flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  AI Resume Studio &amp; ATS
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Build verified, ATS-optimized resumes with real-time parse compatibility scoring and QR-verifiable skill tokens.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 border-t border-white/5">
                <span>Build Resume</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature Card 5 */}
            <Link
              href="/student/interview"
              className="p-6 rounded-3xl bg-[#0e101a] border border-white/5 hover:border-purple-500/40 transition-all space-y-4 group flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  AI Mock Interview Prep
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Domain-validated mock interviews with live question synthesis and STAR framework evaluation scoring.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400 pt-2 border-t border-white/5">
                <span>Practice Session</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature Card 6 */}
            <Link
              href="/industry/recruitment"
              className="p-6 rounded-3xl bg-[#0e101a] border border-white/5 hover:border-purple-500/40 transition-all space-y-4 group flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                  Recruiter Kanban &amp; Pipelines
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Corporate applicant tracking, drag-and-drop Kanban hiring stages, and instant credential verification.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-pink-400 pt-2 border-t border-white/5">
                <span>Access Recruiter Kanban</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

          {/* VIBRANT PURPLE ACCENT BANNER (Direct Match to Photo 1's Right-Side Purple Block) */}
          <div className="rounded-3xl bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#4f46e5] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none rounded-full blur-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-200">
                  ENTERPRISE &amp; INSTITUTIONAL PIPELINE
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  From verified curricula to high-impact hiring pipelines
                </h3>
                <p className="text-purple-100 text-sm leading-relaxed max-w-xl">
                  Everything institutions and enterprises need to generate validated, job-ready graduates with zero ambiguity — included from day one.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3 text-xs sm:text-sm font-medium">
                <div className="p-3 bg-white/10 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>10+ verified skill domains (CS, AI, AYUSH, Core Eng, Biotech)</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Automated quality &amp; credential verification gates</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Full audit trail per candidate assessment record</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Direct export to corporate applicant tracking pipelines</span>
                </div>
              </div>
            </div>
          </div>

          {/* METRICS AT A GLANCE (Direct Match to Photo 1 "Metrics at a glance") */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Metrics at a glance</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs">‹</button>
                <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs">›</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformStats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-[#0e101a] border border-white/5 space-y-3 hover:border-purple-500/30 transition-all shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      PASS
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">{stat.value}</div>
                  <p className="text-xs text-slate-400">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 1: UNIFIED MULTI-ROLE ECOSYSTEM (#platform) */}
      <section id="platform" className="py-24 border-b border-white/5 bg-[#090b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              CROSS-FUNCTIONAL WORKSPACES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Unified Multi-Role Ecosystem</h2>
            <p className="text-slate-400 text-sm">
              Integrated career intelligence serving Students, Industry Recruiters, Academic Institutions, Faculty Mentors, and Governance Administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Student Portal', role: 'STUDENT', href: '/student/dashboard', icon: GraduationCap, color: 'border-cyan-500/30 text-cyan-400 hover:border-cyan-500/60' },
              { title: 'Industry Portal', role: 'INDUSTRY', href: '/industry/dashboard', icon: Building2, color: 'border-purple-500/30 text-purple-400 hover:border-purple-500/60' },
              { title: 'Institution Center', role: 'INSTITUTION', href: '/institution/dashboard', icon: Briefcase, color: 'border-pink-500/30 text-pink-400 hover:border-pink-500/60' },
              { title: 'Faculty Mentorship', role: 'FACULTY', href: '/faculty/dashboard', icon: BookOpen, color: 'border-teal-500/30 text-teal-400 hover:border-teal-500/60' },
              { title: 'Admin Governance', role: 'ADMIN', href: '/admin/dashboard', icon: ShieldCheck, color: 'border-indigo-500/30 text-indigo-400 hover:border-indigo-500/60' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.title}
                  href={p.href}
                  className={`p-5 rounded-2xl bg-[#0e101a] border ${p.color} card-hover-lift flex flex-col justify-between space-y-4 group shadow-xl backdrop-blur-sm transition-all`}
                >
                  <Icon className="w-6 h-6" />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{p.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Access {p.role} Portal</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: COLLABORATION & MENTORSHIP (#collaboration) */}
      <section id="collaboration" className="py-20 border-b border-white/5 bg-[#07070b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">Academia-Industry Collaboration</h2>
            <p className="text-slate-400 text-sm">
              Connecting faculty mentors, academic researchers, and corporate hiring leaders with verifiable credibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/faculty/mentorship" className="p-6 rounded-2xl bg-[#0e101a] border border-white/5 card-hover-lift space-y-3 group shadow-xl hover:border-purple-500/30 transition-all">
              <Users className="w-6 h-6 text-purple-400" />
              <h3 className="text-base font-bold text-white group-hover:text-purple-300">Faculty Mentorship</h3>
              <p className="text-xs text-slate-400">Guide student career pathways and oversee skill verification milestones.</p>
            </Link>

            <Link href="/faculty/research" className="p-6 rounded-2xl bg-[#0e101a] border border-white/5 card-hover-lift space-y-3 group shadow-xl hover:border-cyan-500/30 transition-all">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300">Research &amp; Projects</h3>
              <p className="text-xs text-slate-400">Collaborate on interdisciplinary research projects and industrial training.</p>
            </Link>

            <Link href="/institution/skill-intelligence" className="p-6 rounded-2xl bg-[#0e101a] border border-white/5 card-hover-lift space-y-3 group shadow-xl hover:border-pink-500/30 transition-all">
              <BarChart3 className="w-6 h-6 text-pink-400" />
              <h3 className="text-base font-bold text-white group-hover:text-pink-300">Curriculum Intelligence</h3>
              <p className="text-xs text-slate-400">Align academic coursework with real-time market demand and job requirements.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: INSIGHTS & GOVERNANCE (#insights) */}
      <section id="insights" className="py-20 border-b border-white/5 bg-[#090b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">Placement Intelligence &amp; Admin Audit</h2>
            <p className="text-slate-400 text-sm">
              Real-time institutional placement tracking, verification management, and system governance logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/institution/placements" className="p-6 rounded-2xl bg-[#0e101a] border border-white/5 card-hover-lift space-y-3 group shadow-xl hover:border-purple-500/30 transition-all">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h3 className="text-base font-bold text-white group-hover:text-purple-300">Placement Command Center</h3>
              <p className="text-xs text-slate-400">Track institutional placement statistics, offers, and hiring velocity.</p>
            </Link>

            <Link href="/admin/verification" className="p-6 rounded-2xl bg-[#0e101a] border border-white/5 card-hover-lift space-y-3 group shadow-xl hover:border-cyan-500/30 transition-all">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300">Verification Queue</h3>
              <p className="text-xs text-slate-400">Review and approve candidate skill credentials and institution profiles.</p>
            </Link>

            <Link href="/admin/audit" className="p-6 rounded-2xl bg-[#0e101a] border border-white/5 card-hover-lift space-y-3 group shadow-xl hover:border-pink-500/30 transition-all">
              <FileCheck className="w-6 h-6 text-pink-400" />
              <h3 className="text-base font-bold text-white group-hover:text-pink-300">System Audit Logs</h3>
              <p className="text-xs text-slate-400">Security event monitoring, access logs, and governance auditing.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#07070b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#141824] border border-white/10 p-0.5 flex items-center justify-center">
              <img src="/cyclops-icon.png" alt="Cyclops" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-sm font-bold text-white">Cyclops — Ecosystem Talent &amp; Skill Intelligence Platform</span>
          </div>
          <p className="text-xs text-slate-500 font-mono">© 2026 Cyclops AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
