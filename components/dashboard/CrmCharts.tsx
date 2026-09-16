'use client';

import React from 'react';

// 1. DualWaveChart - Skill Velocity & Mock Assessment Trend (Top Right in Photo 2)
export function DualWaveChart({
  title = "Performance & Velocity Trend",
  peakLabel = "Peak: 96%",
  statementLinkText = "View full analytics",
  onStatementClick,
}: {
  title?: string;
  peakLabel?: string;
  statementLinkText?: string;
  onStatementClick?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl space-y-3 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-300">{title}</h3>
      </div>

      <div className="relative h-28 w-full">
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="waveCyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waveBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Secondary Blue Wave */}
          <path
            d="M0,100 Q40,65 90,80 T180,60 T250,45 T300,75 L300,120 L0,120 Z"
            fill="url(#waveBlueGrad)"
          />
          <path
            d="M0,100 Q40,65 90,80 T180,60 T250,45 T300,75"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            opacity="0.7"
          />

          {/* Primary Cyan Wave */}
          <path
            d="M0,110 Q50,90 100,95 T180,55 T230,30 T300,60 L300,120 L0,120 Z"
            fill="url(#waveCyanGrad)"
          />
          <path
            d="M0,110 Q50,90 100,95 T180,55 T230,30 T300,60"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
          />

          {/* Peak Point Glowing Node */}
          <circle cx="230" cy="30" r="5" fill="#22d3ee" className="animate-pulse" />
          <circle cx="230" cy="30" r="9" fill="#06b6d4" opacity="0.3" />
        </svg>

        {/* Floating Tooltip Pill at Peak */}
        <div className="absolute top-1 right-12 -translate-y-1/2 px-2 py-0.5 rounded-md bg-gradient-to-r from-teal-500 to-cyan-500 text-[10px] font-mono font-bold text-white shadow-md border border-cyan-300/40 pointer-events-none">
          {peakLabel}
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer" onClick={onStatementClick}>
          {statementLinkText} →
        </span>
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 inline-block" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600 inline-block" />
        </div>
      </div>
    </div>
  );
}

// 2. DualLineChart - Placement Pipeline & Shortlist Velocity (Center Wide in Photo 2)
export function DualLineChart({
  title = "Applications Submitted vs Shortlists & Offers",
  metric1Label = "Shortlists & Offers",
  metric2Label = "Applications Sent",
  peakBadgeText = "Max Fit = 94%",
}: {
  title?: string;
  metric1Label?: string;
  metric2Label?: string;
  peakBadgeText?: string;
}) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  return (
    <div className="rounded-2xl bg-[#141824] border border-white/5 p-6 shadow-xl space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-slate-200">{title}</h3>
        <div className="flex items-center gap-4 text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">{metric1Label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-pink-400 border-dashed" />
            <span className="text-slate-400">{metric2Label}</span>
          </div>
        </div>
      </div>

      {/* SVG Chart with Peak Badge */}
      <div className="relative h-44 w-full">
        <svg viewBox="0 0 700 180" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          {/* Horizontal Grid lines */}
          {[30, 65, 100, 135, 170].map((y, idx) => (
            <line
              key={idx}
              x1="30"
              y1={y}
              x2="690"
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="3 3"
            />
          ))}

          {/* Y-axis values */}
          <text x="5" y="34" fill="#64748b" fontSize="10" fontFamily="monospace">90</text>
          <text x="5" y="69" fill="#64748b" fontSize="10" fontFamily="monospace">70</text>
          <text x="5" y="104" fill="#64748b" fontSize="10" fontFamily="monospace">50</text>
          <text x="5" y="139" fill="#64748b" fontSize="10" fontFamily="monospace">30</text>
          <text x="5" y="174" fill="#64748b" fontSize="10" fontFamily="monospace">10</text>

          {/* Dotted secondary pink line (Applications Sent) */}
          <path
            d="M40,160 Q90,140 140,110 T240,120 T350,130 T450,110 T560,95 T670,125"
            fill="none"
            stroke="#f472b6"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Solid cyan line (Shortlists & Offers) with peak at x=460, y=45 */}
          <path
            d="M40,150 Q90,120 140,85 T240,95 T350,110 T460,45 T560,75 T670,90"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
          />

          {/* Subtle cyan glow area below */}
          <path
            d="M40,150 Q90,120 140,85 T240,95 T350,110 T460,45 T560,75 T670,90 L670,170 L40,170 Z"
            fill="url(#cyanAreaGrad)"
            opacity="0.1"
          />

          <defs>
            <linearGradient id="cyanAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Node on the Peak (x=460, y=45) */}
          <circle cx="460" cy="45" r="5" fill="#22d3ee" />
          <circle cx="460" cy="45" r="9" fill="#06b6d4" opacity="0.3" />
        </svg>

        {/* Floating Pink "Max = 88" Pill Badge (exactly matching Photo 2) */}
        <div
          className="absolute -top-1 left-[63%] -translate-x-1/2 px-2.5 py-1 rounded-md bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-mono text-[11px] font-bold shadow-lg shadow-pink-500/30 border border-pink-300/40 flex items-center gap-1"
        >
          <span>{peakBadgeText}</span>
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex justify-between pl-8 pr-3 text-[10px] font-mono text-slate-500 uppercase">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

// 3. DonutCategoryChart - Skills & Opportunities By Domain (Bottom Left in Photo 2)
export function DonutCategoryChart({
  title = "Opportunities By Skill Domain",
  categories = [
    { label: "Core AI & ML", percent: 42, color: "#06b6d4" },
    { label: "Full Stack Web", percent: 28, color: "#3b82f6" },
    { label: "Healthcare / AYUSH", percent: 18, color: "#8b5cf6" },
    { label: "Core Engineering", percent: 12, color: "#14b8a6" },
  ],
}: {
  title?: string;
  categories?: { label: string; percent: number; color: string }[];
}) {
  return (
    <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl space-y-3">
      <h3 className="text-xs font-semibold text-slate-300">{title}</h3>

      <div className="flex items-center justify-around pt-2">
        {/* SVG Donut Ring */}
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Segment 1 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#06b6d4"
              strokeWidth="14"
              strokeDasharray="100 138"
              strokeDashoffset="0"
            />
            {/* Segment 2 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="14"
              strokeDasharray="66 172"
              strokeDashoffset="-102"
            />
            {/* Segment 3 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#8b5cf6"
              strokeWidth="14"
              strokeDasharray="42 196"
              strokeDashoffset="-170"
            />
            {/* Segment 4 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#14b8a6"
              strokeWidth="14"
              strokeDasharray="30 208"
              strokeDashoffset="-214"
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-[11px]">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-slate-300 font-medium">{cat.label}</span>
              <span className="text-slate-500 font-mono text-[10px] ml-auto">{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. DonutProgressRing - Application Shortlists vs Pipeline (Bottom Center in Photo 2)
export function DonutProgressRing({
  title = "Application Shortlist Conversion",
  centerValue = "88.4%",
  centerLabel = "Shortlist Rate",
  primaryPercent = "80.7%",
  primaryLabel = "Shortlisted / Placed",
  secondaryPercent = "19.3%",
  secondaryLabel = "In Screening",
  newTicketsPercent,
  returnedPercent,
}: {
  title?: string;
  centerValue?: string;
  centerLabel?: string;
  primaryPercent?: string;
  primaryLabel?: string;
  secondaryPercent?: string;
  secondaryLabel?: string;
  newTicketsPercent?: string;
  returnedPercent?: string;
}) {
  const displayPrimaryPercent = primaryPercent || newTicketsPercent || "80.7%";
  const displaySecondaryPercent = secondaryPercent || returnedPercent || "19.3%";

  return (
    <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl space-y-3">
      <h3 className="text-xs font-semibold text-slate-300">{title}</h3>

      <div className="flex items-center justify-around pt-1">
        {/* Magenta Donut with Center Text */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="12"
            />
            {/* Vibrant Magenta Ring */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#ec4899"
              strokeWidth="12"
              strokeDasharray="185 55"
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Small Purple Complement */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#9333ea"
              strokeWidth="12"
              strokeDasharray="35 205"
              strokeDashoffset="-195"
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-slate-400 font-medium leading-tight">{centerLabel}</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5">{centerValue}</span>
          </div>
        </div>

        {/* Legend items */}
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-fuchsia-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono">{displayPrimaryPercent}</div>
              <div className="text-xs font-medium text-slate-200">{primaryLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-purple-500" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono">{displaySecondaryPercent}</div>
              <div className="text-xs font-medium text-slate-200">{secondaryLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. VerticalBarChart - Weekly Activity & Practice (Bottom Right in Photo 2)
export function VerticalBarChart({
  title = "Weekly Preparation & Practice Hours",
  days = [
    { day: "Mon", height: 50 },
    { day: "Tue", height: 35 },
    { day: "Wed", height: 75 },
    { day: "Thu", height: 60 },
    { day: "Fri", height: 95 },
    { day: "Sat", height: 55 },
  ],
}: {
  title?: string;
  days?: { day: string; height: number }[];
}) {
  return (
    <div className="rounded-2xl bg-[#141824] border border-white/5 p-5 shadow-xl space-y-3">
      <h3 className="text-xs font-semibold text-slate-300">{title}</h3>

      {/* Bar Chart Area */}
      <div className="relative h-28 w-full flex items-end justify-between px-2 pt-2 border-b border-white/5">
        {/* Subtle grid line */}
        <div className="absolute top-4 left-0 right-0 border-b border-dashed border-white/5" />
        <div className="absolute top-12 left-0 right-0 border-b border-dashed border-white/5" />

        {days.map((item) => (
          <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end z-10 w-6">
            <div
              className="w-3 rounded-t-sm bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-500 hover:brightness-125"
              style={{ height: `${item.height}%` }}
            />
          </div>
        ))}
      </div>

      {/* Days X Axis */}
      <div className="flex justify-between px-2 text-[10px] font-mono text-slate-500 uppercase">
        {days.map((item) => (
          <span key={item.day}>{item.day}</span>
        ))}
      </div>
    </div>
  );
}
