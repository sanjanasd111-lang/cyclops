'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bot,
  Briefcase,
  Users,
  Bell,
  Sparkles,
  Filter,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface CalendarEvent {
  id: string;
  title: string;
  company: string;
  type: 'COMPANY_INTERVIEW' | 'AI_MOCK' | 'ASSESSMENT' | 'DEADLINE';
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  mode: 'VIRTUAL' | 'IN_PERSON';
  locationOrLink: string;
  interviewer?: string;
  status: 'CONFIRMED' | 'UPCOMING' | 'COMPLETED';
  notes?: string;
}

export default function StudentCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetRole, setTargetRole] = useState('Software Engineering');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingType, setBookingType] = useState<'AI_MOCK' | 'COMPANY_INTERVIEW'>('AI_MOCK');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00 AM - 11:45 AM');
  const [bookingTopic, setBookingTopic] = useState('Technical Interview Drill');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  // Month navigation
  const currentDate = new Date();
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(currentDate.toISOString().split('T')[0]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [calRes, profRes] = await Promise.all([
          fetch('/api/student/calendar').then((r) => r.json()).catch(() => ({})),
          fetch('/api/student/profile').then((r) => r.json()).catch(() => ({})),
        ]);

        if (calRes.success && Array.isArray(calRes.data)) {
          setEvents(calRes.data);
        }

        if (profRes.success && profRes.data?.profile?.target_role) {
          const role = profRes.data.profile.target_role;
          setTargetRole(role);
          setBookingTopic(`${role} Technical Rehearsal`);
        }
      } catch (err) {
        console.error('Failed to load placement calendar:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calendar matrix calculation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: bookingTopic || `${targetRole} AI Drill`,
        company: bookingType === 'AI_MOCK' ? 'Cyclops AI Mock Engine' : 'RUAS Central Placement Cell',
        type: bookingType,
        date: bookingDate || selectedDate,
        time: bookingTime,
        duration: '45 mins',
        mode: 'VIRTUAL',
        locationOrLink: bookingType === 'AI_MOCK' ? '/student/copilot' : 'https://meet.google.com/ruas-interview-room',
        interviewer: bookingType === 'AI_MOCK' ? 'Cyclops Autonomous AI Examiner' : 'RUAS Placement Panel',
        status: 'CONFIRMED',
        notes: `Scheduled session for ${targetRole} interview preparation.`,
      };

      const res = await fetch('/api/student/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEvents((prev) => [data.data, ...prev]);
        window.dispatchEvent(new CustomEvent('ruas-notifications-updated'));
      }
      setBookedSuccess(true);
      setTimeout(() => {
        setBookedSuccess(false);
        setShowBookModal(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to book interview slot:', err);
    }
  };

  const filteredEvents = events.filter((evt) => {
    if (selectedFilter === 'COMPANY') return evt.type === 'COMPANY_INTERVIEW';
    if (selectedFilter === 'MOCK') return evt.type === 'AI_MOCK';
    if (selectedFilter === 'ASSESSMENT') return evt.type === 'ASSESSMENT' || evt.type === 'DEADLINE';
    return true;
  });

  const selectedDateEvents = filteredEvents.filter((evt) => evt.date === selectedDate);

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'COMPANY_INTERVIEW':
        return <Badge className="bg-purple-900/60 text-purple-300 border-purple-500/40 text-[10px]">Company Interview</Badge>;
      case 'AI_MOCK':
        return <Badge className="bg-cyan-900/60 text-cyan-300 border-cyan-500/40 text-[10px]">AI Mock Slot</Badge>;
      case 'ASSESSMENT':
        return <Badge className="bg-emerald-900/60 text-emerald-300 border-emerald-500/40 text-[10px]">Assessment</Badge>;
      case 'DEADLINE':
        return <Badge className="bg-amber-900/60 text-amber-300 border-amber-500/40 text-[10px]">Deadline</Badge>;
    }
  };

  return (
    <PortalLayout role="STUDENT" userTitle="Placement Calendar" userSubtitle="Interview & Assessment Schedules">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-purple-400" /> Interview &amp; Slot Reminders
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Synchronized schedules for campus recruitment drives, company rounds, and on-demand AI mock drills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex bg-[#121524] border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === 'ALL' ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({events.length})
              </button>
              <button
                onClick={() => setSelectedFilter('COMPANY')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === 'COMPANY' ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Interviews
              </button>
              <button
                onClick={() => setSelectedFilter('MOCK')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === 'MOCK' ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AI Mocks
              </button>
            </div>

            <Button
              onClick={() => {
                setBookingDate(selectedDate);
                setShowBookModal(true);
              }}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/50"
            >
              <Plus className="h-4 w-4" /> Book Slot
            </Button>
          </div>
        </div>

        {/* Main Grid: Calendar Matrix & Upcoming Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-white/10 bg-[#0d101d]/90 backdrop-blur-xl shadow-xl">
              <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{monthNames[viewMonth]} {viewYear}</span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevMonth}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextMonth}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-slate-400 font-semibold mb-2">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Empty offsets */}
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-16 rounded-xl bg-white/[0.01]" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
                    const isSelected = selectedDate === dateStr;
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`h-16 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                          isSelected
                            ? 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500'
                            : isToday
                            ? 'border-cyan-500/50 bg-cyan-950/20'
                            : 'border-white/5 bg-[#121524]/60 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[11px] font-bold ${
                              isSelected
                                ? 'text-purple-300'
                                : isToday
                                ? 'text-cyan-400 font-extrabold'
                                : 'text-slate-300 group-hover:text-white'
                            }`}
                          >
                            {dayNum}
                          </span>
                          {isToday && (
                            <span className="text-[8px] font-mono uppercase bg-cyan-950 text-cyan-400 px-1 rounded border border-cyan-500/30">
                              Today
                            </span>
                          )}
                        </div>

                        {/* Event indicator dots/pills */}
                        <div className="space-y-0.5 overflow-hidden">
                          {dayEvents.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              className={`text-[9px] truncate px-1 py-0.2 rounded font-medium ${
                                ev.type === 'COMPANY_INTERVIEW'
                                  ? 'bg-purple-900/80 text-purple-200'
                                  : ev.type === 'AI_MOCK'
                                  ? 'bg-cyan-900/80 text-cyan-200'
                                  : 'bg-emerald-900/80 text-emerald-200'
                              }`}
                            >
                              {ev.company.split(' ')[0]}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-[8px] text-slate-400 block text-right">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            <Card className="border-white/10 bg-[#0d101d]/90 p-4">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  Events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedDateEvents.length} scheduled
                </span>
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No interview rounds or assessments scheduled on this date.
                  <button
                    onClick={() => {
                      setBookingDate(selectedDate);
                      setShowBookModal(true);
                    }}
                    className="block mx-auto mt-2 text-purple-400 hover:text-purple-300 underline font-semibold"
                  >
                    + Schedule an AI Mock Interview slot
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedDateEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl border border-white/10 bg-[#141828] hover:border-purple-500/40 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{evt.title}</span>
                            {getEventBadge(evt.type)}
                          </div>
                          <span className="text-xs text-purple-300 font-semibold">{evt.company}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10 shrink-0">
                          {evt.time}
                        </span>
                      </div>

                      {evt.notes && (
                        <p className="text-[11px] text-slate-400 leading-relaxed bg-[#0b0e1a] p-2 rounded-lg border border-white/5">
                          {evt.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                          {evt.mode === 'VIRTUAL' ? (
                            <span className="flex items-center gap-1 text-cyan-400">
                              <Video className="h-3 w-3" /> Virtual Session
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-400">
                              <MapPin className="h-3 w-3" /> {evt.locationOrLink}
                            </span>
                          )}
                          {evt.interviewer && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-slate-500" /> {evt.interviewer}
                            </span>
                          )}
                        </div>

                        {evt.mode === 'VIRTUAL' && (
                          <a
                            href={evt.locationOrLink}
                            target={evt.locationOrLink.startsWith('http') ? '_blank' : '_self'}
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white font-semibold text-[11px] transition-all"
                          >
                            Join Session <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Upcoming Placement Rounds & Prep Assistant (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* All Upcoming Rounds Card */}
            <Card className="border-white/10 bg-[#0d101d]/90 backdrop-blur-xl">
              <CardHeader className="p-4 border-b border-white/5">
                <CardTitle className="text-xs font-bold text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-400" /> Active Placement Slots Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <CalendarIcon className="h-7 w-7 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">No active placement rounds currently scheduled</p>
                    <p className="text-[11px] text-slate-500">Apply to campus opportunities or book an on-demand AI mock rehearsal.</p>
                    <button
                      onClick={() => setShowBookModal(true)}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold border border-purple-500/30 transition-all"
                    >
                      + Schedule AI Mock Drill
                    </button>
                  </div>
                ) : (
                  filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl border border-white/5 bg-[#121524]/70 hover:border-white/15 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{evt.company}</span>
                          {getEventBadge(evt.type)}
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          {evt.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-medium">{evt.title}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <CalendarIcon className="h-3 w-3 text-purple-400" /> {evt.date}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-cyan-400" /> {evt.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Cyclops AI Mock Interview Prompt Box */}
            <Card className="border-cyan-500/20 bg-gradient-to-br from-[#0c1328] via-[#0d101d] to-cyan-950/30 p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Cyclops AI Interview Simulator</h3>
                  <p className="text-[11px] text-slate-400">Prepare for {targetRole} corporate interview rounds</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Run an instant 15-minute simulated technical interview. The AI analyzes your answers, grades code readability, and evaluates ATS keyword alignment.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/student/copilot"
                  className="w-full text-center py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-950/50"
                >
                  Launch AI Simulator →
                </Link>
                <Link
                  href="/student/resume/report"
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10 transition-all text-center"
                >
                  Report
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal: Book Slot */}
        {showBookModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#121526] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-purple-400" /> Schedule Interview / Practice Slot
                </h3>
                <button
                  onClick={() => setShowBookModal(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              {bookedSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Slot Confirmed!</h4>
                  <p className="text-xs text-slate-400">Added to your Placement Calendar and sync reminders.</p>
                </div>
              ) : (
                <form onSubmit={handleBookSlot} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Session Type</label>
                    <select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value as any)}
                      className="w-full bg-[#181d33] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                    >
                      <option value="AI_MOCK">Cyclops AI Mock Practice Session</option>
                      <option value="COMPANY_INTERVIEW">Company Recruiter Interview Round</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Topic or Role</label>
                    <Input
                      value={bookingTopic}
                      onChange={(e) => setBookingTopic(e.target.value)}
                      placeholder="e.g. System Design, Full-Stack Architecture, HR Rehearsal"
                      className="bg-[#181d33] border-white/10 text-white text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Date</label>
                      <Input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="bg-[#181d33] border-white/10 text-white text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Time Slot</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-[#181d33] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                      >
                        <option>10:00 AM - 10:45 AM</option>
                        <option>11:00 AM - 11:45 AM</option>
                        <option>02:00 PM - 02:45 PM</option>
                        <option>04:30 PM - 05:15 PM</option>
                        <option>06:00 PM - 06:45 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowBookModal(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                    >
                      Confirm Slot
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
