"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, Plus, MapPin, Calendar, Users, Building2 } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function IndustryOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/industry/opportunities')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOpportunities(d.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout role="INDUSTRY">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              Active Opportunities
            </Badge>
            <h1 className="text-2xl font-extrabold text-white mt-1">Organization Postings</h1>
            <p className="text-xs text-slate-400">Manage live internships, jobs, and industrial projects.</p>
          </div>

          <Link href="/industry/opportunities/create">
            <Button variant="emerald" size="sm" className="gap-1.5 font-bold shadow-md text-xs">
              <Plus className="h-4 w-4" /> Create New Opportunity
            </Button>
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/60 p-12 text-center space-y-3">
            <Building2 className="h-12 w-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No active opportunities found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Create your first opportunity to discover candidate matches, schedule interviews, and manage applications.</p>
            <Link href="/industry/opportunities/create">
              <Button variant="emerald" size="sm" className="gap-1.5 font-bold mt-2 text-xs">
                <Plus className="h-4 w-4" /> Post Opportunity
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <Card key={opp.id} className="border-slate-800 bg-slate-900/90 p-5 space-y-3 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {opp.location} {opp.is_remote && '(Remote)'}
                    </p>
                  </div>
                  <Badge variant="emerald" className="text-[10px] font-mono">{opp.opportunity_type}</Badge>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{opp.description}</p>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Taxonomy Skills Required:</span>
                  <div className="flex flex-wrap gap-1">
                    {opp.required_skills?.map((sk: any) => (
                      <span key={sk.skill_name} className="bg-slate-950 text-slate-200 border border-slate-800 text-[10px] px-2 py-0.5 rounded">
                        {sk.skill_name} ({sk.min_proficiency}%)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Stipend: <strong className="text-emerald-400">₹{opp.stipend_amount}/mo</strong></span>
                  <Link href={`/industry/candidates?opportunity_id=${opp.id}`}>
                    <Button variant="emerald" size="sm" className="gap-1 text-xs font-bold">
                      <Users className="h-3.5 w-3.5" /> <span>Rank Candidates</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
