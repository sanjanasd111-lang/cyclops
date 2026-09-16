"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, Bell, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Skills', href: '#skills' },
    { label: 'Opportunities', href: '#opportunities' },
    { label: 'Collaboration', href: '#collaboration' },
    { label: 'Insights', href: '#insights' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        scrolled
          ? 'border-slate-800/80 bg-slate-950/90 backdrop-blur-md shadow-lg'
          : 'border-slate-800/40 bg-slate-950/60 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Subtle Institutional Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-700/80 p-0.5 shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
              <img src="/cyclops-icon.png" alt="Cyclops" className="h-full w-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Cyclops <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.2 border border-blue-500/20 rounded">AI</span>
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-block h-3.5 w-px bg-slate-800" />
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium tracking-wide">
            Talent &amp; Skill Intelligence Platform
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-emerald-400 transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors" title="Notifications">
              <Bell className="h-4 w-4" />
            </button>
          </Link>

          <Link href="/login">
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>Sign In</span>
            </button>
          </Link>

          <Link href="/register">
            <Button variant="emerald" size="sm" className="gap-1 shadow-sm">
              <span>Get Started</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-80" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2 text-xs font-medium text-slate-300">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link href="/login" className="w-full">
              <Button variant="outline" size="sm" className="w-full">Sign In</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="emerald" size="sm" className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
