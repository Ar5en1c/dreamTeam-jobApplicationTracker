import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Applications", href: "/applications", icon: Briefcase },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    // Navigate to homepage when available
    navigate("/dashboard");
  };

  const handleMouseEnter = () => {
    if (!isMobileMenuOpen && window.innerWidth >= 1024) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Delay expansion by 200ms to match collapse behavior
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(true);
      }, 200);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileMenuOpen && window.innerWidth >= 1024) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Delay collapse by 200ms to prevent accidental collapses
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 200);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Mobile backdrop with blur */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/55 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isMobileMenuOpen ? "268px" : (isExpanded ? "268px" : "80px")
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group/sidebar relative z-30 flex flex-col overflow-hidden overflow-x-hidden",
          "bg-gradient-to-b from-surface-1/95 via-surface-1/80 to-surface-1/65",
          "border-r border-borderMuted/45 backdrop-blur-2xl shadow-[0_32px_82px_-46px_rgba(15,23,42,0.62)]",
          "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),transparent_72%)] before:opacity-80 before:content-[''] before:overflow-hidden",
          "after:absolute after:inset-0 after:-z-20 after:bg-gradient-to-b after:from-primary-500/14 after:via-transparent after:to-transparent after:blur-[90px] after:overflow-hidden",
          "fixed inset-y-0 left-0 -translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "lg:static lg:inset-auto lg:m-6 lg:h-[calc(100vh-3rem)] lg:translate-x-0 lg:rounded-3xl lg:border lg:border-borderMuted/55 lg:shadow-[0_45px_110px_-70px_rgba(15,23,42,0.55)]",
          "sidebar-mobile-fix",
          isMobileMenuOpen && "translate-x-0"
        )}
        style={{ overflowX: 'hidden' }}
      >

        {/* Logo Area */}
        <button
          onClick={handleLogoClick}
          className="relative flex h-20 items-center px-4 w-full cursor-pointer hover:bg-surface-2/30 transition-colors group"
        >
          <div className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/25 to-transparent" />
          <motion.div
            className="flex h-full items-center overflow-hidden"
            layout
          >
            <motion.div
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.05rem] bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white shadow-[0_18px_40px_-18px_rgba(99,102,241,0.68)]"
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.96 }}
            >
              <Sparkles className="relative z-10 h-5 w-5 text-white drop-shadow-[0_8px_18px_rgba(99,102,241,0.6)]" />
              <span className="pointer-events-none absolute inset-0 rounded-[1.05rem] border border-white/30 opacity-70" />
              <span className="pointer-events-none absolute -inset-4 rounded-[1.35rem] bg-primary-500/25 blur-3xl" />
            </motion.div>
            <AnimatePresence>
              {(isExpanded || isMobileMenuOpen) && (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 flex flex-col"
                >
                  <span className="mt-1 text-base font-semibold leading-tight text-foreground">
                    {APP_NAME}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-4 py-6">
          {navigation.map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive: navIsActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-0",
                    "before:absolute before:left-2 before:top-1/2 before:h-8 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-gradient-to-b before:from-primary-400 before:via-primary-500 before:to-primary-600 before:opacity-0 before:transition-opacity before:duration-300 before:content-['']",
                    navIsActive
                      ? "text-primary-50 before:opacity-100 bg-gradient-to-r from-primary-500/25 via-primary-500/10 to-transparent border border-primary-500/35 shadow-[0_26px_48px_-34px_rgba(99,102,241,0.7)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60 hover:before:opacity-70"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.span
                      className={cn(
                        "relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200",
                        isActive
                          ? "bg-gradient-to-br from-primary-500/25 via-primary-500/15 to-transparent text-primary-100"
                          : "bg-surface-2/40 text-muted-foreground group-hover:text-primary-400"
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="relative z-10 h-5 w-5" />
                      {isActive && (
                        <span className="pointer-events-none absolute inset-0 rounded-xl border border-primary-400/40" />
                      )}
                    </motion.span>

                    {/* Label with fade animation */}
                    <AnimatePresence>
                      {(isExpanded || isMobileMenuOpen) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.18 }}
                          className={cn(
                            "relative z-10 whitespace-nowrap",
                            isActive
                              ? "font-semibold text-foreground"
                              : "text-current"
                          )}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active indicator dot (collapsed mode) */}
                    {isActive && !isExpanded && !isMobileMenuOpen && (
                      <motion.span
                        layoutId="sidebar-active-dot"
                        className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary-400 shadow-[0_0_12px_rgba(99,102,241,0.7)]"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 250,
                          damping: 20,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="space-y-2 border-t border-borderMuted/35 px-4 py-5 overflow-x-hidden">
          {bottomNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-0",
                  "before:absolute before:left-2 before:top-1/2 before:h-8 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-gradient-to-b before:from-primary-400 before:via-primary-500 before:to-primary-600 before:opacity-0 before:transition-opacity before:duration-300 before:content-['']",
                  isActive
                    ? "text-primary-50 before:opacity-100 bg-gradient-to-r from-primary-500/25 via-primary-500/10 to-transparent border border-primary-500/35 shadow-[0_26px_48px_-34px_rgba(99,102,241,0.7)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60 hover:before:opacity-70"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    className={cn(
                      "relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200",
                      isActive
                        ? "bg-gradient-to-br from-primary-500/25 via-primary-500/15 to-transparent text-foreground"
                        : "bg-surface-2/40 text-muted-foreground group-hover:text-primary-400"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="relative z-10 h-5 w-5" />
                    {isActive && (
                      <span className="pointer-events-none absolute inset-0 rounded-xl border border-primary-400/40" />
                    )}
                  </motion.span>
                  <AnimatePresence>
                    {(isExpanded || isMobileMenuOpen) && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "relative z-10 whitespace-nowrap",
                          isActive
                            ? "font-semibold text-foreground"
                            : "text-current"
                        )}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}

          {/* Sign Out Button with enhanced hover */}
          <motion.button
            onClick={handleSignOut}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-200",
              "hover:bg-error-500/10 hover:text-error-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500/50"
            )}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-error-500/10 text-error-500 transition-colors duration-200 group-hover:bg-error-500/15"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="h-5 w-5" />
            </motion.span>
            <AnimatePresence>
              {(isExpanded || isMobileMenuOpen) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};
