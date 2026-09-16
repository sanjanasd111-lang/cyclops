'use client';

import React from 'react';
import { ResumeContentData, ATSTemplate } from '@/lib/types/resume-types';
import { Mail, Phone, MapPin, Linkedin, CheckCircle2, Award, BookOpen, Briefcase, Code, GraduationCap, Sparkles } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeContentData;
  template?: ATSTemplate;
  zoom?: number;
}

export function ResumePreview({ data, template = 'modern', zoom = 1 }: ResumePreviewProps) {
  const p = data.personalInfo || {};
  const education = data.education || [];
  const experience = data.experience || [];
  const projects = data.projects || [];
  const skills = data.skills || [];
  const certifications = data.certifications || [];
  const achievements = data.achievements || [];

  return (
    <div className="w-full overflow-auto flex justify-center bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-2xl min-h-[700px]">
      <div
        className="bg-white text-slate-900 font-sans shadow-2xl transition-transform origin-top duration-200"
        style={{
          width: '210mm',
          minHeight: '270mm',
          padding: '14mm 14mm',
          transform: `scale(${zoom})`,
          boxSizing: 'border-box',
        }}
      >
        {/* ========================================== */}
        {/* TEMPLATE 1: MODERN (Indigo & Clean Badges) */}
        {/* ========================================== */}
        {template === 'modern' && (
          <div className="space-y-4 text-xs leading-normal">
            {/* Header */}
            <div className="border-b-2 border-indigo-600 pb-3">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {p.fullName || 'YOUR FULL NAME'}
              </h1>
              {p.headline && <p className="text-indigo-600 font-bold text-xs mt-0.5">{p.headline}</p>}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-1.5">
                {p.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-indigo-500" /> {p.email}
                  </span>
                )}
                {p.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-indigo-500" /> {p.phone}
                  </span>
                )}
                {p.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-indigo-500" /> {p.location}
                  </span>
                )}
                {p.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="h-3 w-3 text-indigo-500" /> {p.linkedin}
                  </span>
                )}
              </div>
            </div>

            {/* Executive Summary */}
            {p.summary && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1 border-b border-indigo-100 pb-0.5">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
              </div>
            )}

            {/* Core Skills & Competencies */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1.5 border-b border-indigo-100 pb-0.5">
                  Core Skills & Verified Badges
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s.id || s.name}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-950 font-semibold text-[11px] rounded border border-indigo-200 flex items-center gap-1"
                    >
                      {s.name}
                      {s.isVerified && <CheckCircle2 className="h-3 w-3 text-indigo-600" />}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience / Practical Training */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1.5 border-b border-indigo-100 pb-0.5">
                  Professional Experience & Training
                </h2>
                <div className="space-y-2.5">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{exp.title}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                      </div>
                      <div className="text-[11px] text-indigo-700 font-semibold mb-0.5">{exp.company} {exp.location && `• ${exp.location}`}</div>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1.5 border-b border-indigo-100 pb-0.5">
                  Technical & Academic Projects
                </h2>
                <div className="space-y-2.5">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{proj.title}</span>
                        {proj.technologies.length > 0 && (
                          <span className="text-[10px] text-indigo-700 font-mono bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            {proj.technologies.join(', ')}
                          </span>
                        )}
                      </div>
                      {proj.description && <p className="text-[11px] text-slate-600 italic mb-0.5">{proj.description}</p>}
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                        {proj.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1 border-b border-indigo-100 pb-0.5">
                  Education & Qualifications
                </h2>
                <div className="space-y-1.5">
                  {education.map((ed) => (
                    <div key={ed.id} className="flex justify-between items-start text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{ed.degree} in {ed.fieldOfStudy}</div>
                        <div className="text-slate-600">{ed.institution}</div>
                      </div>
                      <div className="text-right text-slate-500 font-mono text-[11px]">
                        <div>{ed.graduationYear}</div>
                        {ed.gpa && <div className="text-indigo-700 font-semibold">{ed.gpa}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Achievements */}
            {(certifications.length > 0 || achievements.length > 0) && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                {certifications.length > 0 && (
                  <div>
                    <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1 border-b border-indigo-100 pb-0.5">
                      Certifications
                    </h2>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                      {certifications.map((c) => (
                        <li key={c.id}>
                          <span className="font-semibold">{c.name}</span> ({c.issuer})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {achievements.length > 0 && (
                  <div>
                    <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1 border-b border-indigo-100 pb-0.5">
                      Key Honors & Achievements
                    </h2>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                      {achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =============================================== */}
        {/* TEMPLATE 2: PROFESSIONAL (Executive Corporate CV) */}
        {/* =============================================== */}
        {template === 'professional' && (
          <div className="space-y-4 text-xs font-serif leading-normal">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-3">
              <h1 className="text-2xl font-bold tracking-wide uppercase text-slate-900">{p.fullName || 'YOUR FULL NAME'}</h1>
              {p.headline && <p className="text-slate-700 font-sans italic text-xs mt-0.5">{p.headline}</p>}
              <div className="flex justify-center items-center gap-3 text-slate-700 font-sans text-[11px] mt-1.5">
                {p.email && <span>{p.email}</span>}
                {p.phone && <span>• {p.phone}</span>}
                {p.location && <span>• {p.location}</span>}
                {p.linkedin && <span>• {p.linkedin}</span>}
              </div>
            </div>

            {/* Executive Summary */}
            {p.summary && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
                  Executive Summary
                </h2>
                <p className="text-slate-800 text-xs leading-relaxed">{p.summary}</p>
              </div>
            )}

            {/* Core Skills & Badges */}
            {skills.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-300 pb-0.5">
                  Core Skills & Domain Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {skills.map((s) => (
                    <span
                      key={s.id || s.name}
                      className="px-2 py-0.5 bg-slate-100 text-slate-900 font-semibold text-[11px] rounded border border-slate-300 flex items-center gap-1"
                    >
                      {s.name}
                      {s.isVerified && <CheckCircle2 className="h-3 w-3 text-emerald-700" />}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-300 pb-0.5">
                  Professional Experience & Training
                </h2>
                <div className="space-y-2.5">
                  {experience.map((e) => (
                    <div key={e.id}>
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{e.title} — {e.company}</span>
                        <span className="font-sans text-[11px] text-slate-600">{e.startDate} – {e.isCurrent ? 'Present' : e.endDate}</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-800 text-xs space-y-0.5 mt-0.5">
                        {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-300 pb-0.5">
                  Key Projects & Case Studies
                </h2>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{proj.title}</span>
                        {proj.technologies.length > 0 && (
                          <span className="font-sans text-[10px] text-slate-600 font-mono">[{proj.technologies.join(', ')}]</span>
                        )}
                      </div>
                      {proj.description && <p className="text-slate-700 italic text-[11px]">{proj.description}</p>}
                      <ul className="list-disc list-inside text-slate-800 text-xs space-y-0.5">
                        {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
                  Education & Qualifications
                </h2>
                <div className="space-y-1 font-sans text-xs">
                  {education.map((ed) => (
                    <div key={ed.id} className="flex justify-between">
                      <span><strong>{ed.degree}</strong> in {ed.fieldOfStudy}, {ed.institution}</span>
                      <span className="font-mono text-[11px] text-slate-600">{ed.graduationYear}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Achievements */}
            {(certifications.length > 0 || achievements.length > 0) && (
              <div className="grid grid-cols-2 gap-4 font-sans text-xs">
                {certifications.length > 0 && (
                  <div>
                    <h2 className="font-bold text-[11px] uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
                      Certifications
                    </h2>
                    <ul className="list-disc list-inside text-slate-800 space-y-0.5">
                      {certifications.map((c) => (
                        <li key={c.id}><strong>{c.name}</strong> ({c.issuer})</li>
                      ))}
                    </ul>
                  </div>
                )}
                {achievements.length > 0 && (
                  <div>
                    <h2 className="font-bold text-[11px] uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
                      Honors & Awards
                    </h2>
                    <ul className="list-disc list-inside text-slate-800 space-y-0.5">
                      {achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================== */}
        {/* TEMPLATE 3: MINIMAL (Monospace Clean Tech) */}
        {/* =========================================== */}
        {template === 'minimal' && (
          <div className="space-y-3.5 text-xs font-mono">
            {/* Header */}
            <div className="pb-2 border-b border-slate-400">
              <h1 className="text-xl font-bold uppercase">{p.fullName || 'YOUR NAME'}</h1>
              <p className="text-slate-600 text-[11px] mt-0.5">{p.headline} | {p.email} | {p.phone} | {p.location}</p>
            </div>

            {p.summary && <p className="text-slate-800 text-xs leading-relaxed">{p.summary}</p>}

            {skills.length > 0 && (
              <div>
                <div className="font-bold uppercase text-slate-900 border-b border-slate-300 mb-1 text-[11px]">[ CORE SKILLS ]</div>
                <div className="text-slate-700 text-xs">{skills.map(s => `${s.name}${s.isVerified ? '*' : ''}`).join(', ')}</div>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <div className="font-bold uppercase text-slate-900 border-b border-slate-300 mb-1.5 text-[11px]">[ EXPERIENCE ]</div>
                {experience.map(e => (
                  <div key={e.id} className="mb-2">
                    <div className="font-bold">{e.title} @ {e.company} ({e.startDate} - {e.endDate || 'Present'})</div>
                    {e.bullets.map((b, i) => <div key={i} className="text-slate-700 text-[11px]">- {b}</div>)}
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <div className="font-bold uppercase text-slate-900 border-b border-slate-300 mb-1.5 text-[11px]">[ PROJECTS ]</div>
                {projects.map(pr => (
                  <div key={pr.id} className="mb-2">
                    <div className="font-bold">{pr.title}</div>
                    {pr.description && <div className="text-slate-600 text-[11px] italic">{pr.description}</div>}
                    {pr.bullets.map((b, i) => <div key={i} className="text-slate-700 text-[11px]">- {b}</div>)}
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div>
                <div className="font-bold uppercase text-slate-900 border-b border-slate-300 mb-1 text-[11px]">[ EDUCATION ]</div>
                {education.map(ed => (
                  <div key={ed.id} className="text-xs">{ed.degree} in {ed.fieldOfStudy} - {ed.institution} ({ed.graduationYear})</div>
                ))}
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <div className="font-bold uppercase text-slate-900 border-b border-slate-300 mb-1 text-[11px]">[ CERTIFICATIONS ]</div>
                {certifications.map(c => (
                  <div key={c.id} className="text-xs">- {c.name} ({c.issuer})</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* TEMPLATE 4: ACADEMIC (Research & Clinical Publication) */}
        {/* ======================================================= */}
        {template === 'academic' && (
          <div className="space-y-4 text-xs font-serif leading-relaxed">
            {/* Header */}
            <div className="text-center border-b pb-2">
              <h1 className="text-xl font-bold uppercase text-slate-900">{p.fullName || 'FULL NAME'}</h1>
              <p className="text-slate-700 font-sans text-xs font-semibold">{p.headline}</p>
              <p className="text-slate-600 font-sans text-[11px]">{p.email} • {p.phone} • {p.location}</p>
            </div>

            {p.summary && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase text-slate-900 border-b pb-0.5 mb-1">Academic Profile & Summary</h2>
                <p className="text-slate-800">{p.summary}</p>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase text-slate-900 border-b pb-0.5 mb-1">Education & Qualifications</h2>
                {education.map(ed => (
                  <div key={ed.id} className="mb-1.5">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{ed.institution}</span>
                      <span className="font-sans font-normal text-[11px]">{ed.graduationYear}</span>
                    </div>
                    <div className="text-slate-800">{ed.degree} in {ed.fieldOfStudy} {ed.gpa && `(GPA: ${ed.gpa})`}</div>
                  </div>
                ))}
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase text-slate-900 border-b pb-0.5 mb-1">Clinical & Practical Experience</h2>
                {experience.map(e => (
                  <div key={e.id} className="mb-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{e.title} — {e.company}</span>
                      <span className="font-sans text-[11px] text-slate-600">{e.startDate} – {e.isCurrent ? 'Present' : e.endDate}</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-800 space-y-0.5">
                      {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase text-slate-900 border-b pb-0.5 mb-1">Research & Capstone Projects</h2>
                {projects.map(pr => (
                  <div key={pr.id} className="mb-2">
                    <div className="font-bold text-slate-900">{pr.title}</div>
                    {pr.description && <p className="text-slate-700 italic text-[11px]">{pr.description}</p>}
                    <ul className="list-disc list-inside text-slate-800 space-y-0.5">
                      {pr.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase text-slate-900 border-b pb-0.5 mb-1">Domain Expertise & Technical Skills</h2>
                <p className="text-slate-800">{skills.map(s => `${s.name}${s.isVerified ? ' (Verified)' : ''}`).join(' • ')}</p>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 className="font-sans font-bold text-[11px] uppercase text-slate-900 border-b pb-0.5 mb-1">Publications & Certifications</h2>
                <ul className="list-disc list-inside text-slate-800 space-y-0.5">
                  {certifications.map(c => <li key={c.id}>{c.name} — {c.issuer}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
