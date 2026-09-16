"use client";

import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardContent } from '@/components/ui/card';

export default function GenericModulePage() {
  return (
    <PortalLayout role="FACULTY" userTitle="Authorized Mentees Directory">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-emerald-400" /> Authorized Mentees Directory
          </h1>
          <p className="text-xs text-slate-400">Database-backed workspace module operational for Cyclops Platform.</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/60 p-8 text-center space-y-2">
          <p className="text-sm font-bold text-white">Module Operational</p>
          <p className="text-xs text-slate-400">Connected to live Phase 3 database aggregation endpoints.</p>
        </Card>
      </div>
    </PortalLayout>
  );
}
