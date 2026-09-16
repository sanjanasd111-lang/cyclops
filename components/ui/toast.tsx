'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toastMethods = {
    success: (msg: string, dur?: number) => addToast(msg, 'success', dur),
    error: (msg: string, dur?: number) => addToast(msg, 'error', dur),
    info: (msg: string, dur?: number) => addToast(msg, 'info', dur),
    warning: (msg: string, dur?: number) => addToast(msg, 'warning', dur),
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-slate-900/95 text-emerald-200';
      case 'error':
        return 'border-red-500/40 bg-slate-900/95 text-red-200';
      case 'warning':
        return 'border-amber-500/40 bg-slate-900/95 text-amber-200';
      case 'info':
      default:
        return 'border-blue-500/40 bg-slate-900/95 text-blue-200';
    }
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all transform duration-200 ease-out ${getBorderColor(
              t.type
            )}`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {getIcon(t.type)}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider to avoid crashes
    return {
      toast: {
        success: (msg: string) => console.log('[Toast Success]:', msg),
        error: (msg: string) => console.error('[Toast Error]:', msg),
        info: (msg: string) => console.info('[Toast Info]:', msg),
        warning: (msg: string) => console.warn('[Toast Warning]:', msg),
      },
      removeToast: () => {},
    };
  }
  return context;
}
