'use client';

import React, { useState } from 'react';
import { ResumeContentData, ATSTemplate } from '@/lib/types/resume-types';
import { UserSkill } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Trash2, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface ResumeEditorProps {
  data: ResumeContentData;
  onChange: (updated: ResumeContentData) => void;
  verifiedSkills: UserSkill[];
  template: ATSTemplate;
  onTemplateChange: (template: ATSTemplate) => void;
  onGenerateAI?: () => void;
  isGeneratingAI?: boolean;
}

export function ResumeEditor({
  data,
  onChange,
  verifiedSkills,
  template,
  onTemplateChange,
  onGenerateAI,
  isGeneratingAI = false,
}: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState('personal');

  const p = data.personalInfo || { fullName: '', email: '' };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const syncVerifiedSkills = () => {
    const existingNames = new Set((data.skills || []).map((s) => s.name.toLowerCase()));
    const newSkills = [...(data.skills || [])];

    verifiedSkills.forEach((vs) => {
      if (!existingNames.has(vs.skill_name.toLowerCase())) {
        newSkills.push({
          id: vs.id || `sk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: vs.skill_name,
          category: vs.category || 'Verified Skill',
          proficiency: vs.proficiency_score,
          isVerified: true,
        });
      }
    });

    onChange({
      ...data,
      skills: newSkills,
    });
  };

  // Education helpers
  const addEducation = () => {
    const newEd = {
      id: `ed-${Date.now()}`,
      institution: 'University Name',
      degree: 'B.Tech / Degree',
      fieldOfStudy: 'Major Branch',
      graduationYear: '2025',
      gpa: '8.0 CGPA',
    };
    onChange({ ...data, education: [...(data.education || []), newEd] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: (data.education || []).filter((e) => e.id !== id) });
  };

  // Experience helpers
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      title: 'Intern / Specialist',
      company: 'Company / Organization',
      location: 'City, Country',
      startDate: '2024',
      endDate: 'Present',
      isCurrent: true,
      bullets: ['Developed domain solution using key technical and clinical tools.'],
    };
    onChange({ ...data, experience: [...(data.experience || []), newExp] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: (data.experience || []).filter((e) => e.id !== id) });
  };

  // Projects helpers
  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'Project Title',
      description: 'Brief overview of practical implementation.',
      technologies: ['Core Skill 1', 'Tool 2'],
      bullets: ['Built end-to-end implementation applying domain techniques.'],
    };
    onChange({ ...data, projects: [...(data.projects || []), newProj] });
  };

  const removeProject = (id: string) => {
    onChange({ ...data, projects: (data.projects || []).filter((p) => p.id !== id) });
  };

  // Skills helpers
  const removeSkill = (id: string) => {
    onChange({ ...data, skills: (data.skills || []).filter((s) => s.id !== id) });
  };

  const addSkill = (name: string) => {
    if (!name.trim()) return;
    const newSk = {
      id: `sk-${Date.now()}`,
      name: name.trim(),
      category: 'General',
      isVerified: false,
    };
    onChange({ ...data, skills: [...(data.skills || []), newSk] });
  };

  // Certifications helpers
  const addCert = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      issueDate: '2024',
    };
    onChange({ ...data, certifications: [...(data.certifications || []), newCert] });
  };

  const removeCert = (id: string) => {
    onChange({ ...data, certifications: (data.certifications || []).filter((c) => c.id !== id) });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
      <CardHeader className="border-b border-slate-800 pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span>Resume Content Editor</span>
          </CardTitle>
          <p className="text-xs text-slate-400">Edit sections or sync verified skills from your profile.</p>
        </div>
        {onGenerateAI && (
          <Button
            onClick={onGenerateAI}
            disabled={isGeneratingAI}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
          >
            {isGeneratingAI ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {isGeneratingAI ? 'Building with AI...' : 'Pre-fill with AI'}
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Template Selector Bar */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-300">ATS Template:</span>
          <div className="flex gap-1.5">
            {(['modern', 'professional', 'minimal', 'academic'] as ATSTemplate[]).map((t) => (
              <Button
                key={t}
                variant={template === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTemplateChange(t)}
                className={`text-xs capitalize py-1 h-7 ${
                  template === t ? 'bg-indigo-600 text-white font-bold' : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Section Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-950 border border-slate-800 p-1 w-full justify-start overflow-x-auto text-xs">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="skills">Skills ({data.skills?.length || 0})</TabsTrigger>
            <TabsTrigger value="projects">Projects ({data.projects?.length || 0})</TabsTrigger>
            <TabsTrigger value="experience">Experience ({data.experience?.length || 0})</TabsTrigger>
            <TabsTrigger value="education">Education ({data.education?.length || 0})</TabsTrigger>
            <TabsTrigger value="certifications">Certs & Achievements</TabsTrigger>
          </TabsList>

          {/* TAB 1: PERSONAL INFO */}
          <TabsContent value="personal" className="space-y-3 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">Full Name</label>
                <Input
                  value={p.fullName || ''}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="bg-slate-950 border-slate-800 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Professional Headline</label>
                <Input
                  value={p.headline || ''}
                  onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                  placeholder="e.g. Software Engineer | Computer Science Student"
                  className="bg-slate-950 border-slate-800 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Email Address</label>
                <Input
                  value={p.email || ''}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="student@university.edu"
                  className="bg-slate-950 border-slate-800 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Phone Number</label>
                <Input
                  value={p.phone || ''}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-slate-950 border-slate-800 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Location</label>
                <Input
                  value={p.location || ''}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="New Delhi, India"
                  className="bg-slate-950 border-slate-800 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">LinkedIn / Portfolio Link</label>
                <Input
                  value={p.linkedin || ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/profile"
                  className="bg-slate-950 border-slate-800 text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium">Professional Summary</label>
              <Textarea
                value={p.summary || ''}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                placeholder="2-3 sentences summarizing your academic background, core skills, and target career ambition."
                rows={3}
                className="bg-slate-950 border-slate-800 text-xs mt-1 min-h-[90px]"
              />
            </div>
          </TabsContent>

          {/* TAB 2: SKILLS */}
          <TabsContent value="skills" className="space-y-3 pt-3">
            <div className="flex items-center justify-between bg-indigo-950/40 p-3 rounded-lg border border-indigo-800/50">
              <div>
                <h4 className="text-xs font-bold text-indigo-300">Sync Platform Verified Skills</h4>
                <p className="text-[11px] text-slate-400">Import verified skills from your Cyclops profile with 1-click.</p>
              </div>
              <Button onClick={syncVerifiedSkills} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Sync Verified Skills
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                id="new-skill-input"
                placeholder="Type new skill and press enter..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSkill((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {data.skills?.map((s) => (
                <span
                  key={s.id}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
                    s.isVerified
                      ? 'bg-indigo-950/80 text-indigo-200 border-indigo-700'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  {s.name}
                  {s.isVerified && <CheckCircle2 className="h-3 w-3 text-indigo-400" />}
                  <button onClick={() => removeSkill(s.id)} className="text-slate-400 hover:text-red-400 ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: PROJECTS */}
          <TabsContent value="projects" className="space-y-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Academic & Independent Projects</span>
              <Button onClick={addProject} size="sm" variant="outline" className="text-xs border-slate-700 gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Project
              </Button>
            </div>

            {data.projects?.map((proj, idx) => (
              <div key={proj.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <Input
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...data.projects];
                      updated[idx].title = e.target.value;
                      onChange({ ...data, projects: updated });
                    }}
                    placeholder="Project Title"
                    className="bg-slate-900 border-slate-700 text-xs font-bold w-3/4"
                  />
                  <Button
                    onClick={() => removeProject(proj.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:bg-red-950/50 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  value={proj.description}
                  onChange={(e) => {
                    const updated = [...data.projects];
                    updated[idx].description = e.target.value;
                    onChange({ ...data, projects: updated });
                  }}
                  placeholder="Short Description"
                  className="bg-slate-900 border-slate-700 text-xs"
                />
                <Textarea
                  value={proj.bullets?.join('\n') || ''}
                  onChange={(e) => {
                    const updated = [...data.projects];
                    updated[idx].bullets = e.target.value.split('\n');
                    onChange({ ...data, projects: updated });
                  }}
                  placeholder="Bullet points (one per line). Follow Action + Technology + Problem + Impact structure."
                  rows={3}
                  className="bg-slate-900 border-slate-700 text-xs min-h-[80px]"
                />
              </div>
            ))}
          </TabsContent>

          {/* TAB 4: EXPERIENCE */}
          <TabsContent value="experience" className="space-y-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Internships & Professional Roles</span>
              <Button onClick={addExperience} size="sm" variant="outline" className="text-xs border-slate-700 gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Experience
              </Button>
            </div>

            {data.experience?.map((exp, idx) => (
              <div key={exp.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <Input
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...data.experience];
                      updated[idx].title = e.target.value;
                      onChange({ ...data, experience: updated });
                    }}
                    placeholder="Role Title e.g. Clinical Trainee / Software Intern"
                    className="bg-slate-900 border-slate-700 text-xs font-bold w-1/2"
                  />
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...data.experience];
                      updated[idx].company = e.target.value;
                      onChange({ ...data, experience: updated });
                    }}
                    placeholder="Organization / Enterprise"
                    className="bg-slate-900 border-slate-700 text-xs w-1/3"
                  />
                  <Button
                    onClick={() => removeExperience(exp.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:bg-red-950/50 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Textarea
                  value={exp.bullets?.join('\n') || ''}
                  onChange={(e) => {
                    const updated = [...data.experience];
                    updated[idx].bullets = e.target.value.split('\n');
                    onChange({ ...data, experience: updated });
                  }}
                  placeholder="Responsibility bullet points (one per line)."
                  rows={3}
                  className="bg-slate-900 border-slate-700 text-xs min-h-[80px]"
                />
              </div>
            ))}
          </TabsContent>

          {/* TAB 5: EDUCATION */}
          <TabsContent value="education" className="space-y-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Degrees & Qualifications</span>
              <Button onClick={addEducation} size="sm" variant="outline" className="text-xs border-slate-700 gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Education
              </Button>
            </div>

            {data.education?.map((ed, idx) => (
              <div key={ed.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <Input
                    value={ed.degree}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx].degree = e.target.value;
                      onChange({ ...data, education: updated });
                    }}
                    placeholder="Degree e.g. B.Tech / BAMS"
                    className="bg-slate-900 border-slate-700 text-xs font-bold w-1/3"
                  />
                  <Input
                    value={ed.institution}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx].institution = e.target.value;
                      onChange({ ...data, education: updated });
                    }}
                    placeholder="Institution Name"
                    className="bg-slate-900 border-slate-700 text-xs w-1/2"
                  />
                  <Button
                    onClick={() => removeEducation(ed.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:bg-red-950/50 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* TAB 6: CERTIFICATIONS & ACHIEVEMENTS */}
          <TabsContent value="certifications" className="space-y-3 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Certifications & Accreditations</span>
              <Button onClick={addCert} size="sm" variant="outline" className="text-xs border-slate-700 gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Certification
              </Button>
            </div>

            {data.certifications?.map((c, idx) => (
              <div key={c.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center gap-2">
                <Input
                  value={c.name}
                  onChange={(e) => {
                    const updated = [...(data.certifications || [])];
                    updated[idx].name = e.target.value;
                    onChange({ ...data, certifications: updated });
                  }}
                  placeholder="Certification Name"
                  className="bg-slate-900 border-slate-700 text-xs font-bold w-1/2"
                />
                <Input
                  value={c.issuer}
                  onChange={(e) => {
                    const updated = [...(data.certifications || [])];
                    updated[idx].issuer = e.target.value;
                    onChange({ ...data, certifications: updated });
                  }}
                  placeholder="Issuer / Board"
                  className="bg-slate-900 border-slate-700 text-xs w-1/3"
                />
                <Button
                  onClick={() => removeCert(c.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:bg-red-950/50 h-7 w-7 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
