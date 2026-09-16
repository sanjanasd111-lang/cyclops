"use client";

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/institution/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setReports(data.data);
        }
      });
  }, []);

  return (
    <PortalLayout role="INSTITUTION" userTitle="Institutional Reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" /> Institutional Skill & Placement Reports
          </h1>
          <p className="text-xs text-slate-400">Generated institutional analytical reports for accreditation and academic audits.</p>
        </div>

        <div className="space-y-4">
          {reports.map((rep) => (
            <Card key={rep.id} className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{rep.title}</h3>
                    <p className="text-xs text-slate-400">Period: {rep.period} • Generated: {new Date(rep.generated_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="saffron" className="text-xs">{rep.report_type}</Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-300">Key Findings:</p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    {rep.findings?.map((f: string, idx: number) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
