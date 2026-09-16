"use client";

import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Users } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [trainer, setTrainer] = useState('');

  useEffect(() => {
    fetch('/api/faculty/workshops')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setWorkshops(data.data);
        }
      });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await fetch('/api/faculty/workshops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, trainer_name: trainer, capacity: 40 }),
    });
    setTitle('');
    setTrainer('');
    fetch('/api/faculty/workshops')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setWorkshops(data.data);
      });
  };

  return (
    <PortalLayout role="FACULTY" userTitle="Workshops Console">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-400" /> Faculty Workshop Publisher & Registrations
          </h1>
          <p className="text-xs text-slate-400">Publish targeted skill enhancement workshops and track student registrations.</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white">Publish New Skill Workshop</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Workshop Title (e.g. Biostatistics Masterclass)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs flex-1 text-slate-200"
              />
              <Input
                placeholder="Trainer / Expert Name..."
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs sm:w-64 text-slate-200"
              />
              <Button type="submit" variant="emerald" size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Publish Workshop
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {workshops.map((w) => (
            <Card key={w.id} className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{w.title}</h3>
                    <p className="text-xs text-slate-400">Trainer: {w.trainer_name || 'Guest Expert'} • Mode: {w.mode}</p>
                  </div>
                  <Badge variant="saffron" className="text-xs">
                    {w.registered_student_ids?.length || 0} / {w.capacity} Registered
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
