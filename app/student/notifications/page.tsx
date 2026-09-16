'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Clock,
  Briefcase,
  Award,
  AlertCircle,
  FileText,
  Trash2,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        let readIds = new Set<string>();
        try {
          const stored = localStorage.getItem('ruas_read_notification_ids');
          if (stored) JSON.parse(stored).forEach((id: string) => readIds.add(id));
        } catch {}
        const merged = data.data.map((n: NotificationItem) => ({
          ...n,
          is_read: n.is_read || readIds.has(n.id),
        }));
        setNotifications(merged);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      try {
        const stored = localStorage.getItem('ruas_read_notification_ids');
        const readIds = stored ? JSON.parse(stored) : [];
        if (!readIds.includes(id)) {
          readIds.push(id);
          localStorage.setItem('ruas_read_notification_ids', JSON.stringify(readIds));
        }
      } catch {}

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      window.dispatchEvent(new CustomEvent('ruas-notifications-updated'));

      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: id }),
      });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const allIds = notifications.map((n) => n.id);
      try {
        localStorage.setItem('ruas_read_notification_ids', JSON.stringify(allIds));
      } catch {}

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      window.dispatchEvent(new CustomEvent('ruas-notifications-updated'));

      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all: true }),
      });
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const filteredList = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'APPLICATION':
        return <Briefcase className="h-4 w-4 text-blue-400" />;
      case 'INTERVIEW':
        return <Clock className="h-4 w-4 text-purple-400" />;
      case 'ASSESSMENT':
      case 'SKILL':
        return <Award className="h-4 w-4 text-emerald-400" />;
      case 'VERIFICATION':
        return <ShieldCheck className="h-4 w-4 text-amber-400" />;
      default:
        return <Bell className="h-4 w-4 text-teal-400" />;
    }
  };

  return (
    <PortalLayout role="STUDENT" userTitle="Notification Center" userSubtitle="Student Alerts & Updates">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Bell className="h-6 w-6 text-emerald-400" /> Notifications &amp; System Alerts
            </h1>
            <p className="text-xs text-slate-400">
              Stay updated on company selection offers, interview reminders, application acknowledgments, and credential verifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filter === 'ALL' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('UNREAD')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filter === 'UNREAD' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="gap-1 text-xs border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900 hover:text-white"
              >
                <Check className="h-3 w-3" /> Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">
            Loading notifications...
          </div>
        ) : filteredList.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/60 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">All caught up!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === 'UNREAD'
                ? 'You have read all notifications. No pending alerts.'
                : 'No notification records found in your account.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredList.map((item) => (
              <Card
                key={item.id}
                onClick={() => {
                  if (!item.is_read) handleMarkAsRead(item.id);
                }}
                className={`border transition-all cursor-pointer ${
                  item.is_read
                    ? 'border-slate-800/80 bg-slate-900/40 opacity-80 hover:opacity-100'
                    : 'border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
                }`}
              >
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 mt-0.5">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${item.is_read ? 'text-slate-300' : 'text-white'}`}>
                          {item.title}
                        </h4>
                        {!item.is_read ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" title="Unread" />
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.message}</p>
                      <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-slate-500">
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {item.type === 'INTERVIEW' && (
                          <>
                            <span>•</span>
                            <Link
                              href="/student/calendar"
                              onClick={() => {
                                if (!item.is_read) handleMarkAsRead(item.id);
                              }}
                              className="text-purple-400 hover:text-purple-300 hover:underline"
                            >
                              Open Calendar →
                            </Link>
                          </>
                        )}
                        {item.type === 'APPLICATION' && (
                          <>
                            <span>•</span>
                            <Link
                              href="/student/applications"
                              onClick={() => {
                                if (!item.is_read) handleMarkAsRead(item.id);
                              }}
                              className="text-blue-400 hover:text-blue-300 hover:underline"
                            >
                              View Applications →
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {!item.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(item.id);
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-500/20 shrink-0 h-7 px-2.5"
                    >
                      Mark read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
