'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Github,
  Code2,
  BarChart3,
  Map,
  Briefcase,
  FileBarChart,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Data Sources',
    items: [
      { href: '/dashboard/resume', label: 'Resume', icon: FileText },
      { href: '/dashboard/github', label: 'GitHub', icon: Github },
      { href: '/dashboard/coding', label: 'Coding Profiles', icon: Code2 },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { href: '/dashboard/analysis', label: 'Placement Analysis', icon: BarChart3 },
      { href: '/dashboard/jobs', label: 'Job Recommendations', icon: Briefcase },
      { href: '/dashboard/roadmap', label: 'Learning Roadmap', icon: Map },
    ],
  },
  {
    group: 'Account',
    items: [
      { href: '/dashboard/reports', label: 'Reports', icon: FileBarChart },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { appUser, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/[0.05] flex flex-col z-40"
      style={{ background: 'rgba(17,19,24,0.95)', backdropFilter: 'blur(20px)' }}>

      {/* Logo */}
      <div className="p-5 border-b border-white/[0.05]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00C2FF, #5BE7FF)' }}>
            <span className="text-bg font-display font-bold text-sm">P</span>
          </div>
          <span className="font-display font-semibold text-text">PlacementIQ</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2 px-3">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                return (
                  <Link key={href} href={href}>
                    <motion.div
                      className={cn('sidebar-item', isActive && 'active')}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{label}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Run Analysis CTA */}
      <div className="px-3 mb-3">
        <Link href="/dashboard/analysis/new">
          <div
            className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(0,194,255,0.15), rgba(91,231,255,0.08))',
              border: '1px solid rgba(0,194,255,0.2)',
              color: '#00C2FF',
            }}
          >
            <Zap className="w-4 h-4" />
            Run New Analysis
          </div>
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-white/[0.05] p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          {appUser?.photoURL ? (
            <img src={appUser.photoURL} alt={appUser.displayName} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ background: 'linear-gradient(135deg, #00C2FF, #5BE7FF)', color: '#06070A' }}>
              {appUser?.displayName?.[0] || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">{appUser?.displayName || 'Student'}</p>
            <p className="text-xs text-text-secondary truncate">{appUser?.email || ''}</p>
          </div>
          <button onClick={logout} className="text-text-secondary hover:text-danger transition-colors p-1" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
