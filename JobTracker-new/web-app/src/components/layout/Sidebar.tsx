import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Resume', href: '/resume', icon: FileText },
  { name: 'Applications', href: '/applications', icon: Briefcase },
  // Analytics removed - contains only mock data, will be added in Phase 2
  // { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col w-64 bg-surface-1 border-r border-borderMuted/80 shadow-level-1 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 sidebar-mobile-fix",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-borderMuted/70">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-level-1">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              {APP_NAME}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive: navIsActive }) =>
                  cn(
                    'relative flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1',
                    navIsActive
                      ? 'bg-primary-50 text-primary-700 shadow-level-1 ring-1 ring-primary-200/70 dark:bg-primary-500/20 dark:text-primary-50 dark:ring-primary-500/40'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="pointer-events-none absolute inset-0 rounded-lg bg-primary-500/15 ring-1 ring-inset ring-primary-300/60 backdrop-blur-[1px] dark:bg-primary-500/20 dark:ring-primary-500/50"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "relative z-10 mr-3 h-5 w-5 transition-colors",
                        isActive
                          ? "text-primary-600 dark:text-primary-200"
                          : "text-muted-foreground group-hover:text-primary-500"
                      )}
                    />
                    <span
                      className={cn(
                        "relative z-10",
                        isActive && "font-semibold text-primary-700 dark:text-primary-50"
                      )}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        className="pointer-events-none absolute right-0 h-full w-1 rounded-l-full bg-primary-500 dark:bg-primary-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="space-y-1 border-t border-borderMuted/70 px-3 py-4">
          {bottomNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group",
                  isActive
                    ? "bg-surface-2 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-primary-500" : "group-hover:text-primary-500"
                  )} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/30"
          >
            <LogOut className="mr-3 h-5 w-5 transition-colors" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};
