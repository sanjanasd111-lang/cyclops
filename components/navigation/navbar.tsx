'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Brain,
  Bell,
  User,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Building2,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDashboardRoute } from '@/lib/permissions/routes';
import { UserRole } from '@/lib/types';

export default function GlobalNavbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [userName, setUserName] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthStatus() {
      // 1. Check local demo session cookie
      const cookies = typeof document !== 'undefined' ? document.cookie : '';
      const demoCookieMatch = cookies.match(/ayush_demo_session=([^;]+)/);
      const demoRole = demoCookieMatch ? (demoCookieMatch[1].toUpperCase() as UserRole) : null;

      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          setIsAuthenticated(true);
          const metaRole = (session.user.user_metadata?.role?.toUpperCase() as UserRole) || demoRole || 'STUDENT';
          setRole(metaRole);

          const fullName = session.user.user_metadata?.full_name;
          if (fullName) {
            setUserName(fullName);
          } else if (metaRole === 'STUDENT') {
            fetch('/api/student/profile')
              .then((r) => r.json())
              .then((res) => {
                if (isMounted && res?.data?.profile?.full_name) {
                  setUserName(res.data.profile.full_name);
                } else if (isMounted) {
                  setUserName('Aditi Sharma');
                }
              })
              .catch(() => {
                if (isMounted) setUserName('Aditi Sharma');
              });
          } else {
            const roleDefaults: Record<string, string> = {
              INDUSTRY: 'Recruiter Partner',
              INSTITUTION: 'Dean / Administrator',
              FACULTY: 'Prof. Faculty Mentor',
              ADMIN: 'System Administrator',
            };
            setUserName(roleDefaults[metaRole] || `${metaRole} Member`);
          }
        } else if (demoRole) {
          setIsAuthenticated(true);
          setRole(demoRole);
          if (demoRole === 'STUDENT') {
            fetch('/api/student/profile')
              .then((r) => r.json())
              .then((res) => {
                if (isMounted && res?.data?.profile?.full_name) {
                  setUserName(res.data.profile.full_name);
                } else if (isMounted) {
                  setUserName('Aditi Sharma');
                }
              })
              .catch(() => {
                if (isMounted) setUserName('Aditi Sharma');
              });
          } else {
            const roleDefaults: Record<string, string> = {
              INDUSTRY: 'Recruiter Partner',
              INSTITUTION: 'Dean / Administrator',
              FACULTY: 'Prof. Faculty Mentor',
              ADMIN: 'System Administrator',
            };
            setUserName(roleDefaults[demoRole] || `${demoRole} Member`);
          }
        } else {
          setIsAuthenticated(false);
          setUserName('');
        }
      } catch (err) {
        if (!isMounted) return;
        if (demoRole) {
          setIsAuthenticated(true);
          setRole(demoRole);
          setUserName(`${demoRole} Member`);
        } else {
          setIsAuthenticated(false);
          setUserName('');
        }
      }
    }

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      document.cookie = 'ayush_demo_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    } finally {
      setIsAuthenticated(false);
      setUserName('');
      setUserDropdownOpen(false);
      window.location.href = '/';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { href: '#platform', label: 'Platform' },
    { href: '#skills', label: 'Skills' },
    { href: '#opportunities', label: 'Opportunities' },
    { href: '#collaboration', label: 'Collaboration' },
    { href: '#insights', label: 'Insights' },
  ];

  const dashboardRoute = getDashboardRoute(role);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 p-1 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img src="/cyclops-icon.png" alt="Cyclops Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                Cyclops <span className="ml-1.5 text-[11px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wide text-slate-400">
                Talent &amp; Skill Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Role Badge Dropdown (ONLY visible when authenticated) */}
          {isAuthenticated && (
            <div className="relative hidden md:block ml-4">
              {role === 'STUDENT' ? (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-bold text-slate-300 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>STUDENT PORTAL</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{role} PORTAL</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Switch Portal Role</div>
                      {[
                        { r: 'STUDENT', path: '/student/dashboard', icon: GraduationCap },
                        { r: 'INDUSTRY', path: '/industry/dashboard', icon: Building2 },
                        { r: 'INSTITUTION', path: '/institution/dashboard', icon: Briefcase },
                        { r: 'FACULTY', path: '/faculty/dashboard', icon: BookOpen },
                        { r: 'ADMIN', path: '/admin/dashboard', icon: ShieldCheck },
                      ].map(({ r, path, icon: Icon }) => (
                        <Link
                          key={r}
                          href={path}
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            setRole(r as UserRole);
                            document.cookie = `ayush_demo_session=${r}; path=/; max-age=86400`;
                          }}
                          className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                            role === r ? 'bg-teal-600/20 text-teal-300 font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{r} Portal</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Utilities */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            /* AUTHENTICATED USER CONTROLS */
            <>
              <Link
                href={role === 'STUDENT' ? '/student/notifications' : dashboardRoute}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              </Link>

              <Link href={dashboardRoute}>
                <Button variant="emerald" size="sm" className="gap-1.5 shadow-sm">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </Button>
              </Link>

              <div className="relative pl-2 border-l border-slate-800">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[11px] font-black shadow-sm">
                    {getInitials(userName)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 space-y-1">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <div className="text-xs font-bold text-white truncate">{userName || 'Authenticated User'}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">{role} Workspace</div>
                    </div>

                    <Link
                      href={dashboardRoute}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Dashboard</span>
                    </Link>

                    {role === 'STUDENT' && (
                      <Link
                        href="/student/portfolio"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Digital Passport</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-red-400 hover:bg-red-950/30 transition-colors font-bold border-t border-slate-800/80"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* UNAUTHENTICATED PUBLIC CONTROLS */
            <>
              <Link
                href="/login"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign In</span>
              </Link>

              <Link href="/register">
                <Button variant="emerald" size="sm" className="gap-1 shadow-sm">
                  <span>Get Started</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">{userName || 'Authenticated User'}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">{role} Workspace</div>
                </div>
                <Link
                  href={dashboardRoute}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  Dashboard
                </Link>
              </div>

              {role !== 'STUDENT' && (
                <>
                  <div className="text-xs font-bold uppercase text-slate-500 tracking-wider pt-1">Switch Workspace</div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['STUDENT', 'INDUSTRY', 'INSTITUTION', 'FACULTY', 'ADMIN'] as UserRole[]).map((r) => (
                      <Link
                        key={r}
                        href={getDashboardRoute(r)}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setRole(r);
                          document.cookie = `ayush_demo_session=${r}; path=/; max-age=86400`;
                        }}
                        className={`py-1.5 px-2 rounded text-center text-[11px] font-bold border ${
                          role === r ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {r}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="emerald" size="sm" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}

          <div className="text-xs font-bold uppercase text-slate-500 tracking-wider pt-2">Navigation</div>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 bg-red-950/20 border border-red-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
