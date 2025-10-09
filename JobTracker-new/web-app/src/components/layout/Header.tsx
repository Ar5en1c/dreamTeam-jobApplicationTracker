import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, User, Settings, LogOut, Sparkles, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileAction = (action: string) => {
    setShowProfileMenu(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        signOut();
        break;
    }
  };

  return (
    <header className="relative sticky top-0 z-30 mt-4 w-full overflow-hidden rounded-[1.75rem] border border-borderMuted/50 bg-surface-1/80 px-4 py-3 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.48)] backdrop-blur-2xl sm:px-6 lg:mt-0">
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),transparent_65%)] opacity-80" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/35 to-transparent" />

      <div className="relative z-10 grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4">
        {/* Left cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-borderMuted/45 bg-surface-1/80 text-foreground transition-all duration-200 hover:border-primary-400/50 hover:text-primary-500 lg:hidden"
            onClick={onToggleMobileMenu}
            aria-label="Toggle mobile menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          <div className="hidden lg:flex flex-col leading-tight">
            <span className="text-[11px] font-medium uppercase tracking-[0.5em] text-primary-500/70">
              Workflow
            </span>
            <span className="text-sm text-muted-foreground">
              Plan your next move today
            </span>
          </div>
        </div>

        {/* Center cluster */}
        <div className="flex items-center justify-center">
          <div className="lg:hidden">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-borderMuted/45 bg-surface-1/80 px-3 py-2 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.5)]"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-[0_12px_24px_-16px_rgba(99,102,241,0.55)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Job Tracker
              </span>
            </motion.div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 rounded-2xl border border-borderMuted/45 bg-surface-1/70 px-3 py-2 text-xs font-medium text-muted-foreground">
              <span className="inline-flex h-2 w-2 rounded-full bg-success-500 shadow-[0_0_0_6px_rgba(34,197,94,0.18)]" />
              <span>Pipeline health · Stable</span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="primary"
              className="rounded-xl shadow-[0_22px_48px_-28px_rgba(99,102,241,0.6)] transition-all duration-200 hover:shadow-[0_26px_56px_-24px_rgba(99,102,241,0.55)]"
              leftIcon={<Briefcase className="h-4 w-4" />}
              onClick={() => navigate('/applications')}
            >
              New Application
            </Button>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "relative h-10 w-10 rounded-2xl border border-transparent bg-surface-1/70 text-muted-foreground transition-all duration-200",
                "hover:border-primary-400/60 hover:bg-primary-500/10 hover:text-primary-500",
                "focus-visible:ring-primary-500/60"
              )}
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {resolvedTheme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <div className="hidden sm:block h-9 w-px bg-gradient-to-b from-transparent via-borderMuted/60 to-transparent" />

          <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-borderMuted/45 bg-surface-1/70 px-2.5 py-1.5 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.5)]">
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-sm font-semibold text-foreground">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">Job Seeker</p>
            </div>

            <div className="relative" ref={profileRef}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Avatar
                  src={user?.user_metadata?.avatar_url}
                  alt={user?.email || 'User'}
                  fallback={user?.email?.substring(0, 2).toUpperCase() || 'U'}
                  size="default"
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    "ring-2 ring-transparent hover:ring-primary-400/45",
                    "shadow-[0_18px_40px_-24px_rgba(99,102,241,0.45)] hover:shadow-[0_22px_48px_-22px_rgba(99,102,241,0.55)]",
                    showProfileMenu && "ring-primary-500/60 shadow-[0_26px_56px_-24px_rgba(99,102,241,0.6)]"
                  )}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                />
              </motion.div>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={cn(
                      "absolute right-0 top-full mt-3 w-60 z-50 overflow-hidden",
                      "rounded-2xl border border-borderMuted/45 bg-surface-1/95 backdrop-blur-2xl",
                      "shadow-[0_30px_70px_-40px_rgba(15,23,42,0.6)]"
                    )}
                  >
                    <div className="bg-gradient-to-br from-primary-500/10 via-transparent to-transparent px-4 py-3.5 border-b border-borderMuted/45">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2 px-2">
                      <motion.button
                        whileHover={{ x: 2 }}
                        className={cn(
                          "flex w-full items-center rounded-xl px-3 py-2.5 text-sm text-left transition-all duration-150",
                          "hover:bg-surface-2 text-foreground group"
                        )}
                        onClick={() => handleProfileAction('profile')}
                      >
                        <User className="mr-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary-500" />
                        <span className="font-medium">View Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 2 }}
                        className={cn(
                          "flex w-full items-center rounded-xl px-3 py-2.5 text-sm text-left transition-all duration-150",
                          "hover:bg-surface-2 text-foreground group"
                        )}
                        onClick={() => handleProfileAction('settings')}
                      >
                        <Settings className="mr-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary-500" />
                        <span className="font-medium">Settings</span>
                      </motion.button>

                      <div className="my-2 h-px bg-borderMuted/40" />

                      <motion.button
                        whileHover={{ x: 2 }}
                        className={cn(
                          "flex w-full items-center rounded-xl px-3 py-2.5 text-sm text-left transition-all duration-150",
                          "text-error-600 hover:bg-error-500/10 dark:text-error-400 dark:hover:bg-error-900/20"
                        )}
                        onClick={() => handleProfileAction('logout')}
                      >
                        <LogOut className="mr-3 h-4 w-4 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
