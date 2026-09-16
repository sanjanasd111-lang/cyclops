"use client";

import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, CheckCircle2, MessageSquare } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function MentorshipPage() {
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/faculty/mentorship')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMentorships(data.data);
        }
      });
  }, []);

  const handleAddFeedback = async (id: string) => {
    if (!note) return;
    await fetch('/api/faculty/mentorship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ADD_FEEDBACK', mentorshipId: id, author: 'Dr. Rajeshwar Sharma', note }),
    });
    setNote('');
    // refresh
    fetch('/api/faculty/mentorship')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setMentorships(data.data);
      });
  };

  return (
    <PortalLayout role="FACULTY" userTitle="Faculty Mentorship">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-400" /> Student Mentorship & Career Guidance
          </h1>
          <p className="text-xs text-slate-400">Authorized student mentee tracking, milestone logger, and feedback recorder.</p>
        </div>

        <div className="space-y-4">
          {mentorships.map((m) => (
            <Card key={m.id} className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{m.student_name}</h3>
                    <p className="text-xs text-slate-400">{m.academic_branch} • Target Role: <span className="text-emerald-400 font-semibold">{m.target_role || 'Researcher'}</span></p>
                  </div>
                  <Badge variant="emerald" className="text-xs">
                    {m.status} ({m.progress_percent}% Progress)
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-300">Feedback & Review History:</p>
                  {m.feedback_history?.map((f: any, idx: number) => (
                    <div key={idx} className="p-3 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>{f.author}</span>
                        <span>{new Date(f.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-200">{f.note}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add mentorship feedback / recommendation..."
                    value={selectedId === m.id ? note : ''}
                    onChange={(e) => {
                      setSelectedId(m.id);
                      setNote(e.target.value);
                    }}
                    className="bg-slate-950 border-slate-800 text-xs text-slate-200"
                  />
                  <Button size="sm" variant="emerald" onClick={() => handleAddFeedback(m.id)}>
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
