"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, Send, RefreshCw, ShieldCheck, User } from 'lucide-react';
import { PortalLayout } from '@/components/layout/portal-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  timestamp: string;
}

export default function IndustryAIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialGreeting();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchInitialGreeting = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/industry/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'Hello! Introduce yourself as Cyclops Industry Recruiter AI Assistant.' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([
          {
            id: '1',
            sender: 'ai',
            text: data.data.answer,
            source: data.data.source,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/industry/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: promptToSend }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.success ? data.data.answer : 'I could not process that query.',
        source: data.data?.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Error connecting to Industry AI Assistant.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const shortcuts = [
    'Which candidates best match this role?',
    'Why is this candidate a strong match?',
    'What skills are missing across applicants?',
    'What should I ask during the interview?',
  ];

  return (
    <PortalLayout role="INDUSTRY">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Google Gemini AI Studio Recruiter Engine
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Industry Recruiter AI Assistant</h1>
            <p className="text-xs text-slate-400">Context-aware candidate comparison, interview questions, and talent gap intelligence.</p>
          </div>
          <Link href="/industry/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-800 text-slate-300 text-xs">
              Back to Recruiter Console
            </Button>
          </Link>
        </div>

        {/* Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">Recruiter Shortcuts:</span>
          {shortcuts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-colors text-left"
            >
              + {prompt}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <Card className="border-slate-800 bg-slate-900/90 text-white flex flex-col h-[520px] shadow-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 pb-1 border-b border-white/10">
                    <span className="font-semibold">{msg.sender === 'user' ? 'Recruiter' : 'Industry Talent AI'}</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                    {msg.text.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {msg.source && (
                    <div className="pt-2 text-[9px] font-mono text-emerald-400 flex items-center justify-between">
                      <span>Engine: {msg.source}</span>
                      <ShieldCheck className="h-3 w-3 text-emerald-400 inline" />
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                <span>Analyzing candidate database state and generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about candidate rankings, interview questions, or skill gaps..."
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <Button type="submit" disabled={loading || !input.trim()} variant="emerald" size="sm" className="gap-1.5 font-bold text-xs">
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </Card>

      </div>
    </PortalLayout>
  );
}
