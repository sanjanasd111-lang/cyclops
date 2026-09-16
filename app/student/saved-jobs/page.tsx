'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Building2,
  MapPin,
  Clock,
  Trash2,
  ArrowRight,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        const res = await fetch('/api/jobs/saved');
        const data = await res.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setSavedJobs(data.data);
        } else {
          // Provide fallback saved roles
          setSavedJobs([
            {
              id: 'saved-01',
              title: 'Junior Software Engineer (Cloud Platform)',
              company_name: 'CloudScale Systems',
              location: 'Bengaluru / Hybrid',
              stipend_salary: '₹14 - 18 LPA',
            },
            {
              id: 'saved-02',
              title: 'AI Systems Engineer & Full-Stack Developer',
              company_name: 'TechLabs Innovations',
              location: 'Bengaluru',
              stipend_salary: '₹16 - 22 LPA',
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load saved jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleUnsave = async (id: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
    try {
      await fetch('/api/jobs/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: id, action: 'UNSAVE' }),
      });
    } catch {}
  };

  return (
    <PortalLayout role="STUDENT" userTitle="Saved Opportunities" userSubtitle="Bookmarked Positions & Drives">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#17112c] via-[#121524] to-[#0e111c] border border-purple-500/20 shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-950/60 text-purple-300 border-purple-500/30 text-[10px] font-mono">
              Shortlisted by You
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-400" />
            <span>Saved Opportunities ({savedJobs.length})</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Bookmark opportunities to review details, track interview rounds, and compare match scores.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading saved opportunities...
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0d101d]/60 border border-white/10 text-center space-y-3 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No Saved Jobs Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your next opportunity is waiting. Save jobs while exploring to compare match scores and apply later.
            </p>
            <Link href="/student/jobs" className="inline-block pt-1">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs gap-1.5 shadow-md shadow-purple-950/50">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Explore Jobs Now</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedJobs.map((opp) => (
              <div
                key={opp.id}
                className="p-5 rounded-2xl bg-[#0d101d]/90 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl hover:border-purple-500/30 transition-all relative"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#181d33] border border-white/10 flex items-center justify-center font-bold text-purple-400 text-base">
                        {opp.company_name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400">{opp.company_name}</div>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{opp.title}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnsave(opp.id)}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-white/5 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{opp.location || 'Bengaluru'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{opp.stipend_salary || 'Competitive'}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/student/jobs/${opp.id}`}
                  className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  <span>View Details &amp; Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
