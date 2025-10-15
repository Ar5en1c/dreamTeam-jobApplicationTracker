import React, { useState } from "react";
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
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import * as Tooltip from "@radix-ui/react-tooltip";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const isDesktopViewport =
    typeof window !== "undefined" && window.innerWidth >= 1024;
  const showSidebarContent = isExpanded || isMobileMenuOpen;
  const isCollapsedDesktop = !showSidebarContent && isDesktopViewport;

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    // Navigate to homepage when available
    navigate("/dashboard");
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

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
        className={cn(
          "group/sidebar relative z-30 flex flex-col overflow-hidden overflow-x-hidden",
          "bg-surface-1 backdrop-blur-xl",
          "border-r border-borderMuted/45",
          "shadow-xl",
          "fixed inset-y-0 left-0 h-screen -translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "lg:static lg:translate-x-0",
          "sidebar-mobile-fix",
          isMobileMenuOpen && "translate-x-0"
        )}
        style={{
          overflowX: 'hidden',
          backgroundColor: 'var(--surface-1)',
          opacity: 1
        }}
      >

        {/* Header Area with Logo and Toggle */}
        <div
          className="group/header relative flex h-20 items-center border-b border-borderMuted/35 px-2 transition-all duration-200"
        >
          <div className="relative flex w-16 shrink-0 items-center justify-center">
            <button
              type="button"
              onClick={handleLogoClick}
              className="relative z-20 flex h-11 w-11 items-center justify-center rounded-[1.05rem] transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-0"
              aria-label="Go to dashboard"
            >
              <motion.div
                className="relative flex h-full w-full items-center justify-center rounded-[1.05rem] bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300 text-blue-700 shadow-[0_14px_32px_-18px_rgba(15,23,42,0.45)] dark:from-sky-500 dark:via-blue-600 dark:to-indigo-700 dark:text-white"
                whileHover={{ rotate: 3 }}
                whileTap={{ scale: 0.96 }}
              >
                <Sparkles className="relative z-10 h-5 w-5 text-blue-700 drop-shadow-[0_6px_14px_rgba(15,23,42,0.28)] dark:text-white" />
                <span className="pointer-events-none absolute inset-0 rounded-[1.05rem] border border-blue-200/80 dark:border-white/15" />
                <span className="pointer-events-none absolute -inset-3 rounded-[1.35rem] bg-sky-300/30 blur-3xl dark:bg-sky-600/25" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isCollapsedDesktop && (
                <motion.button
                  key="expand-sidebar"
                  type="button"
                  onClick={toggleSidebar}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className={cn(
                    "absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.05rem] border border-borderMuted/45 bg-surface-1/95 text-muted-foreground shadow-sm backdrop-blur-sm",
                    "opacity-0 pointer-events-none transition-all duration-200",
                    "group-hover/header:opacity-100 group-hover/header:pointer-events-auto",
                    "focus-visible:opacity-100 focus-visible:pointer-events-auto",
                    "hover:bg-surface-2/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60",
                    "z-30"
                  )}
                  aria-label="Expand sidebar"
                >
                  <PanelRight className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showSidebarContent && (
              <motion.button
                key="collapse-sidebar"
                type="button"
                onClick={toggleSidebar}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-surface-2/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
                aria-label="Collapse sidebar"
              >
                <PanelLeft className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <Tooltip.Provider delayDuration={200}>
          <nav
            className={cn(
              "flex-1 space-y-2 overflow-y-auto overflow-x-hidden py-6 px-2"
            )}
          >
            {navigation.map((item) => {
              const navLink = (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive: navIsActive }) =>
                    cn(
                      "group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-0",
                      navIsActive
                        ? "text-foreground bg-surface-2/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-2/40",
                      showSidebarContent && "pr-3"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator - vertical bar on left */}
                      {isActive && showSidebarContent && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-foreground rounded-r-full" />
                      )}

                      {/* Icon wrapper - absolute positioning when expanded for consistency */}
                      <div className="flex w-16 shrink-0 items-center justify-center">
                        <item.icon className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          isActive ? "text-foreground" : "text-current"
                        )} />
                      </div>

                      {/* Label with slide animation */}
                      <AnimatePresence mode="wait">
                        {showSidebarContent && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className={cn(
                              "whitespace-nowrap overflow-hidden pl-2",
                              isActive ? "font-medium text-foreground" : "text-current"
                            )}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              );

              // Wrap with tooltip when collapsed on desktop
              if (isCollapsedDesktop) {
                return (
                  <Tooltip.Root key={item.name}>
                    <Tooltip.Trigger asChild>
                      {navLink}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={12}
                        className="z-50 rounded-lg bg-surface-1 px-3 py-2 text-sm font-medium text-foreground shadow-lg border border-borderMuted/50 animate-in fade-in-0 zoom-in-95"
                      >
                        {item.name}
                        <Tooltip.Arrow className="fill-surface-1" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              }

              return navLink;
            })}
          </nav>
        </Tooltip.Provider>

        {/* Bottom Navigation */}
        <Tooltip.Provider delayDuration={200}>
          <div
            className={cn(
              "space-y-2 border-t border-borderMuted/35 py-5 overflow-x-hidden px-2"
            )}
          >
            {bottomNavigation.map((item) => {
              const navLink = (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-0",
                      isActive
                        ? "text-foreground bg-surface-2/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-2/40",
                      showSidebarContent && "pr-3"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator - vertical bar on left */}
                      {isActive && showSidebarContent && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-foreground rounded-r-full" />
                      )}

                      {/* Icon wrapper - absolute positioning when expanded for consistency */}
                      <div className="flex w-16 shrink-0 items-center justify-center">
                        <item.icon className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          isActive ? "text-foreground" : "text-current"
                        )} />
                      </div>

                      {/* Label with slide animation */}
                      <AnimatePresence mode="wait">
                        {showSidebarContent && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className={cn(
                              "whitespace-nowrap overflow-hidden pl-2",
                              isActive ? "font-medium text-foreground" : "text-current"
                            )}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              );

              // Wrap with tooltip when collapsed on desktop
              if (isCollapsedDesktop) {
                return (
                  <Tooltip.Root key={item.name}>
                    <Tooltip.Trigger asChild>
                      {navLink}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={12}
                        className="z-50 rounded-lg bg-surface-1 px-3 py-2 text-sm font-medium text-foreground shadow-lg border border-borderMuted/50 animate-in fade-in-0 zoom-in-95"
                      >
                        {item.name}
                        <Tooltip.Arrow className="fill-surface-1" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              }

              return navLink;
            })}

            {/* Sign Out Button */}
            {isCollapsedDesktop ? (
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="group relative flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-surface-2/40 hover:text-error-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500/50"
                    aria-label="Sign out"
                  >
                    <div className="flex w-16 shrink-0 items-center justify-center">
                      <LogOut className="h-5 w-5 transition-colors duration-200" />
                    </div>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={12}
                    className="z-50 rounded-lg bg-surface-1 px-3 py-2 text-sm font-medium text-foreground shadow-lg border border-borderMuted/50 animate-in fade-in-0 zoom-in-95"
                  >
                    Sign Out
                    <Tooltip.Arrow className="fill-surface-1" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ) : (
              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  "group relative flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-surface-2/40 hover:text-error-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500/50",
                  showSidebarContent && "pr-3"
                )}
              >
                <div className="flex w-16 shrink-0 items-center justify-center">
                  <LogOut className="h-5 w-5 transition-colors duration-200" />
                </div>

                <AnimatePresence mode="wait">
                  {showSidebarContent && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="whitespace-nowrap overflow-hidden pl-2"
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}
          </div>
        </Tooltip.Provider>
      </motion.div>
    </>
  );
};
