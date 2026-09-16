"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useLiveApplications(studentId: string, initialData: any[] = []) {
  const [applications, setApplications] = useState(initialData);
  const supabase = createClient();

  useEffect(() => {
    setApplications(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!studentId) return;

    const channel = supabase
      .channel(`realtime-apps-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setApplications((prev) =>
              prev.map((app) => (app.id === payload.new.id ? { ...app, ...payload.new } : app))
            );
          } else if (payload.eventType === 'INSERT') {
            setApplications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId, supabase]);

  return applications;
}
