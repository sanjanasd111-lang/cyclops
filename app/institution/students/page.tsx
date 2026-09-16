"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Filter, GraduationCap, CheckCircle2, ChevronRight } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudentProfile } from '@/lib/types';

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/institution/students')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setStudents(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.course?.toLowerCase().includes(search.toLowerCase()) ||
      s.career_goal?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout role="INSTITUTION" userTitle="Student Directory">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-400" /> Institutional Student Directory
            </h1>
            <p className="text-xs text-slate-400">Authorized student skill profiles, academic streams, and career readiness scores.</p>
          </div>
          <Badge variant="saffron" className="px-3 py-1 font-mono text-xs">
            {filtered.length} Enrolled Candidates
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search students by name, branch, or target role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-900 border-slate-800 text-slate-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((student) => (
            <Card key={student.id} className="border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold">
                      {student.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{student.full_name || 'Student Candidate'}</h3>
                      <p className="text-xs text-slate-400">{student.course} • Year {student.year}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                    {student.overall_readiness_score || 60}% Ready
                  </Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-300">
                    <span className="text-slate-500">Career Goal:</span> {student.career_goal || 'Ayurvedic Clinical Researcher'}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-500">Academic Branch:</span> {student.academic_stream || student.department || 'Ayurvedic Medicine'}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link href={`/institution/students/${student.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs border-slate-700 hover:bg-slate-800">
                      View Full Profile <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
