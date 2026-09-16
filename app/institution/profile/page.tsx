"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2, ShieldCheck, Mail, Globe, MapPin, Award } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { InstitutionProfile } from '@/lib/types';

export default function InstitutionProfilePage() {
  const [profile, setProfile] = useState<Partial<InstitutionProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/institution/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProfile(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/institution/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout role="INSTITUTION" userTitle={profile.name || "Institution Profile"} userSubtitle={profile.code || "AIIA-DELHI"}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Building2 className="h-6 w-6 text-emerald-400" /> Institution Profile & Accreditation
            </h1>
            <p className="text-xs text-slate-400">Manage verified institutional identity, accreditation, and department configurations.</p>
          </div>
          {profile.verified && (
            <Badge variant="saffron" className="gap-1 px-3 py-1">
              <ShieldCheck className="h-4 w-4" /> Verified Academic Institution
            </Badge>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">General Information</CardTitle>
              <CardDescription className="text-xs">Official institutional metadata reflected in student passports and industry portals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Institution Full Name</Label>
                  <Input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Institution Code</Label>
                  <Input value={profile.code || ''} onChange={(e) => setProfile({ ...profile, code: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Type / Classification</Label>
                  <Input value={profile.type || ''} onChange={(e) => setProfile({ ...profile, type: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Accreditation</Label>
                  <Input value={profile.accreditation || ''} onChange={(e) => setProfile({ ...profile, accreditation: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Established Year</Label>
                  <Input type="number" value={profile.established_year || 2017} onChange={(e) => setProfile({ ...profile, established_year: parseInt(e.target.value, 10) })} className="bg-slate-950 border-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Official Email</Label>
                  <Input value={profile.official_email || ''} onChange={(e) => setProfile({ ...profile, official_email: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Website URL</Label>
                  <Input value={profile.website || ''} onChange={(e) => setProfile({ ...profile, website: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Location / City</Label>
                  <Input value={profile.location || ''} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">About Institution & R&D Scope</Label>
                <Textarea rows={4} value={profile.description || ''} onChange={(e) => setProfile({ ...profile, description: e.target.value })} className="bg-slate-950 border-slate-800" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            {success && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
              </span>
            )}
            <Button variant="emerald" type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" /> {saving ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
