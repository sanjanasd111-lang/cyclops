'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  Target,
  Sparkles,
  Award,
  PlayCircle,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseItem {
  id: string;
  title: string;
  provider: string;
  stream: string;
  skill_target: string;
  gap_addressed: string;
  duration: string;
  expected_boost: string;
  level: string;
  is_priority: boolean;
  status: 'RECOMMENDED' | 'IN_PROGRESS' | 'COMPLETED';
}

const ALL_COURSES: CourseItem[] = [
  // Computer Science & Software Engineering
  {
    id: 'cs-01',
    title: 'Advanced Full-Stack Engineering with Next.js 14 & Distributed Cache',
    provider: 'CloudScale Technical Guild',
    stream: 'Computer Science',
    skill_target: 'Full Stack Web & Next.js',
    gap_addressed: 'Next.js App Router & Server Components',
    duration: '14 Hours',
    expected_boost: '+24 Readiness Pts',
    level: 'Advanced',
    is_priority: true,
    status: 'RECOMMENDED',
  },
  {
    id: 'cs-02',
    title: 'Microservices, Docker Containers & Kubernetes Deployment',
    provider: 'TechLabs Architecture Lab',
    stream: 'Computer Science',
    skill_target: 'DevOps & Cloud Architecture',
    gap_addressed: 'Container Orchestration & CI/CD',
    duration: '10 Hours',
    expected_boost: '+18 Readiness Pts',
    level: 'Intermediate',
    is_priority: true,
    status: 'RECOMMENDED',
  },
  {
    id: 'cs-03',
    title: 'Enterprise Relational Database Indexing & High-Throughput SQL',
    provider: 'RUAS Computing Excellence Center',
    stream: 'Computer Science',
    skill_target: 'PostgreSQL / DBMS',
    gap_addressed: 'Query Optimization & B-Tree Indexing',
    duration: '8 Hours',
    expected_boost: '+15 Readiness Pts',
    level: 'Intermediate',
    is_priority: false,
    status: 'COMPLETED',
  },
  // AI & Data Science
  {
    id: 'ai-01',
    title: 'Modern Generative AI Architecture & Transformer Fine-Tuning',
    provider: 'DeepMind Research Partner Program',
    stream: 'Artificial Intelligence',
    skill_target: 'Generative AI & LLMs',
    gap_addressed: 'LoRA, RAG Pipelines & Embeddings',
    duration: '16 Hours',
    expected_boost: '+26 Readiness Pts',
    level: 'Advanced',
    is_priority: true,
    status: 'RECOMMENDED',
  },
  {
    id: 'ai-02',
    title: 'Scalable Data Engineering & Vector Databases (Pinecone & pgvector)',
    provider: 'VectorAI Institute',
    stream: 'Artificial Intelligence',
    skill_target: 'Vector Databases',
    gap_addressed: 'ANN Search & Vector Indexing',
    duration: '9 Hours',
    expected_boost: '+16 Readiness Pts',
    level: 'Intermediate',
    is_priority: false,
    status: 'RECOMMENDED',
  },
  // BioTech & Health Sciences
  {
    id: 'bio-01',
    title: 'Clinical Trial Biostatistics & Genomic Sequence Analysis',
    provider: 'Serum Biotech Research Guild',
    stream: 'Biotechnology',
    skill_target: 'Biostatistics & Omics',
    gap_addressed: 'Statistical Hypothesis & NGS Pipelines',
    duration: '12 Hours',
    expected_boost: '+20 Readiness Pts',
    level: 'Intermediate',
    is_priority: true,
    status: 'RECOMMENDED',
  },
  {
    id: 'ayush-01',
    title: 'Schedule T GMP Compliance & AYUSH Pharmacovigilance Protocols',
    provider: 'All India Institute of Ayurveda',
    stream: 'Ayurveda',
    skill_target: 'Regulatory Compliance',
    gap_addressed: 'Drug Standardization & CCRAS Norms',
    duration: '10 Hours',
    expected_boost: '+18 Readiness Pts',
    level: 'Intermediate',
    is_priority: true,
    status: 'RECOMMENDED',
  },
];

export default function StudentLearningPage() {
  const [courses, setCourses] = useState<CourseItem[]>(ALL_COURSES);
  const [filter, setFilter] = useState<'ALL' | 'PRIORITY' | 'COMPLETED'>('ALL');
  const [streamFilter, setStreamFilter] = useState<string>('ALL');
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [academicStream, setAcademicStream] = useState<string>('');

  useEffect(() => {
    fetch('/api/student/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.profile) {
          const stream = data.data.profile.academic_stream || '';
          setAcademicStream(stream);
          if (stream.toLowerCase().includes('comp') || stream.toLowerCase().includes('soft')) {
            setStreamFilter('Computer Science');
          } else if (stream.toLowerCase().includes('ai') || stream.toLowerCase().includes('data')) {
            setStreamFilter('Artificial Intelligence');
          } else if (stream.toLowerCase().includes('bio') || stream.toLowerCase().includes('pharma')) {
            setStreamFilter('Biotechnology');
          } else if (stream.toLowerCase().includes('ayush') || stream.toLowerCase().includes('ayur')) {
            setStreamFilter('Ayurveda');
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleEnroll = (id: string) => {
    setEnrolledIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCourses = courses.filter((c) => {
    if (filter === 'PRIORITY' && !c.is_priority) return false;
    if (filter === 'COMPLETED' && c.status !== 'COMPLETED') return false;
    if (streamFilter !== 'ALL' && c.stream !== streamFilter) return false;
    return true;
  });

  return (
    <PortalLayout role="STUDENT" userTitle="Learning Pathways" userSubtitle="Skill Remediation & Certifications">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-purple-950/60 text-purple-300 border-purple-500/40 text-[10px] font-mono">
                Skill Twin Calibration
              </Badge>
              {academicStream && (
                <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 text-[10px] font-mono">
                  Tailored to {academicStream}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-400" /> Recommended Learning Pathways
            </h1>
            <p className="text-xs text-slate-400">
              Micro-courses &amp; capability certifications mapped directly to employer skill gaps.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-[#121524] border border-white/10 p-1 rounded-xl text-xs">
              <button
                onClick={() => setStreamFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  streamFilter === 'ALL' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Domains
              </button>
              <button
                onClick={() => setStreamFilter('Computer Science')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  streamFilter === 'Computer Science' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Software &amp; Cloud
              </button>
              <button
                onClick={() => setStreamFilter('Artificial Intelligence')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  streamFilter === 'Artificial Intelligence' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AI &amp; ML
              </button>
            </div>

            <div className="flex bg-[#121524] border border-white/10 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === 'ALL' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({filteredCourses.length})
              </button>
              <button
                onClick={() => setFilter('PRIORITY')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === 'PRIORITY' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Top Priority
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id) || course.status === 'COMPLETED';

            return (
              <Card
                key={course.id}
                className="border-white/10 bg-[#0d101d]/90 backdrop-blur-xl p-5 space-y-4 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-xl"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        course.is_priority
                          ? 'bg-pink-950/60 text-pink-300 border-pink-500/30 text-[10px]'
                          : 'bg-purple-950/60 text-purple-300 border-purple-500/30 text-[10px]'
                      }
                    >
                      Deficit Target: {course.gap_addressed}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-cyan-400" /> {course.duration}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-400">Offered by: {course.provider}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> {course.expected_boost}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {course.level} Level
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                  <Button
                    onClick={() => handleEnroll(course.id)}
                    size="sm"
                    className={`w-full text-xs font-semibold gap-1.5 transition-all ${
                      isEnrolled
                        ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/40'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/50'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> In Progress (Start Module)
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" /> Enroll in Micro-Course <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
