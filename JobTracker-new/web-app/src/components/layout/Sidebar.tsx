import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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

const ActiveIndicator = () => (
  <motion.div
    layoutId="activeIndicator"
    className={cn(
      "pointer-events-none absolute inset-0 overflow-hidden rounded-[1.05rem]",
      "backdrop-blur-[28px]",
      "bg-[radial-gradient(120%_160%_at_18%_18%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.85)_32%,rgba(219,234,254,0.7)_58%,rgba(125,211,252,0.52)_78%,rgba(56,189,248,0.34)_100%)]",
      "dark:bg-[radial-gradient(120%_160%_at_22%_20%,rgba(255,255,255,0.24)_0%,rgba(148,197,255,0.18)_44%,rgba(59,130,246,0.14)_72%,rgba(15,23,42,0.72)_100%)]",
      "ring-1 ring-sky-400/70 dark:ring-white/12",
      "shadow-[0_24px_52px_-24px_rgba(14,116,144,0.55),0_8px_22px_-12px_rgba(14,116,144,0.35),inset_0_1px_0_rgba(255,255,255,0.9)]",
      "dark:shadow-[0_22px_48px_-24px_rgba(2,6,23,0.78),0_2px_12px_-8px_rgba(8,47,73,0.45),inset_0_1px_0_rgba(255,255,255,0.32)]"
    )}
    transition={{ type: "spring", stiffness: 320, damping: 34 }}
  >
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(160%_160%_at_22%_18%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.6)_46%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(160%_160%_at_20%_18%,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.14)_52%,rgba(255,255,255,0)_100%)] opacity-95"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute left-3 right-3 top-1.5 h-[38%] rounded-full bg-white/95 dark:bg-white/25 blur-2xl opacity-85"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-3 bottom-[9px] h-1/3 rounded-full bg-sky-200/70 dark:bg-primary-400/25 blur-3xl opacity-80"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-3 left-[14px] w-px bg-white/75 dark:bg-white/25 opacity-95"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-2 right-[18px] w-[40%] rounded-full bg-[radial-gradient(100%_160%_at_0%_50%,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(100%_160%_at_0%_50%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_100%)] blur-xl opacity-80"
    />
  </motion.div>
);

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onSidebarToggle?: (isExpanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onSidebarToggle,
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
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onSidebarToggle?.(newExpandedState);
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
          width: isMobileMenuOpen ? "268px" : isExpanded ? "268px" : "80px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "group/sidebar relative z-30 flex flex-col overflow-hidden overflow-x-hidden",
          "bg-surface-1 backdrop-blur-xl",
          "border-r border-borderMuted/45",
          "shadow-xl",
          "fixed inset-y-0 left-0 h-screen -translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "lg:translate-x-0",
          "sidebar-mobile-fix",
          isMobileMenuOpen && "translate-x-0"
        )}
        style={{
          overflowX: "hidden",
          backgroundColor: "var(--surface-1)",
          opacity: 1,
        }}
      >
        {/* Header Area with Logo and Toggle */}
        <div className="group/header relative flex h-20 items-center border-b border-borderMuted/35 px-2 transition-all duration-200">
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
                <Tooltip.Provider delayDuration={200}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
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
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={12}
                        className="z-50 rounded-lg bg-surface-1 px-3 py-2 text-sm font-medium text-foreground shadow-lg border border-borderMuted/50 animate-in fade-in-0 zoom-in-95"
                      >
                        Toggle sidebar
                        <Tooltip.Arrow className="fill-surface-1" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showSidebarContent && (
              <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
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
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      sideOffset={12}
                      className="z-50 rounded-lg bg-surface-1 px-3 py-2 text-sm font-medium text-foreground shadow-lg border border-borderMuted/50 animate-in fade-in-0 zoom-in-95"
                    >
                      Collapse sidebar
                      <Tooltip.Arrow className="fill-surface-1" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <Tooltip.Provider delayDuration={200}>
          <LayoutGroup id="main-nav">
            <nav
              className={cn(
                "flex-1 space-y-2 overflow-y-auto overflow-x-hidden py-6 px-2"
              )}
            >
              {navigation.map((item) => {
                const navLink = (
                  <NavLink
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive: navIsActive }) =>
                      cn(
                        "group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-0",
                        navIsActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-2/40",
                        showSidebarContent && "pr-3"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Pill-shaped active indicator with layout animation */}
                        {isActive && <ActiveIndicator />}

                        {/* Icon wrapper - absolute positioning when expanded for consistency */}
                        <div className="relative flex w-16 shrink-0 items-center justify-center z-10">
                          <item.icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isActive
                                ? "text-primary-600 dark:text-primary-400"
                                : "text-current"
                            )}
                          />
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
                                "relative z-10 whitespace-nowrap overflow-hidden pl-2",
                                isActive
                                  ? "font-medium text-primary-700 dark:text-primary-300"
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
                );

                return (
                  <Tooltip.Root
                    key={item.name}
                    delayDuration={isCollapsedDesktop ? 200 : 0}
                    disableHoverableContent={!isCollapsedDesktop}
                  >
                    <Tooltip.Trigger asChild>{navLink}</Tooltip.Trigger>
                    {isCollapsedDesktop && (
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
                    )}
                  </Tooltip.Root>
                );
              })}
            </nav>
          </LayoutGroup>
        </Tooltip.Provider>

        {/* Bottom Navigation */}
        <Tooltip.Provider delayDuration={200}>
          <LayoutGroup id="bottom-nav">
            <div
              className={cn(
                "space-y-2 border-t border-borderMuted/35 py-5 overflow-x-hidden px-2"
              )}
            >
              {bottomNavigation.map((item) => {
                const navLink = (
                  <NavLink
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-0",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-2/40",
                        showSidebarContent && "pr-3"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Pill-shaped active indicator with layout animation */}
                        {isActive && <ActiveIndicator />}

                        {/* Icon wrapper - absolute positioning when expanded for consistency */}
                        <div className="relative flex w-16 shrink-0 items-center justify-center z-10">
                          <item.icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isActive
                                ? "text-primary-600 dark:text-primary-400"
                                : "text-current"
                            )}
                          />
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
                                "relative z-10 whitespace-nowrap overflow-hidden pl-2",
                                isActive
                                  ? "font-medium text-primary-700 dark:text-primary-300"
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
                );

                return (
                  <Tooltip.Root
                    key={item.name}
                    delayDuration={isCollapsedDesktop ? 200 : 0}
                    disableHoverableContent={!isCollapsedDesktop}
                  >
                    <Tooltip.Trigger asChild>{navLink}</Tooltip.Trigger>
                    {isCollapsedDesktop && (
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
                    )}
                  </Tooltip.Root>
                );
              })}

              {/* Sign Out Button */}
              <Tooltip.Root
                delayDuration={isCollapsedDesktop ? 200 : 0}
                disableHoverableContent={!isCollapsedDesktop}
              >
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={cn(
                      "group relative flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-surface-2/40 hover:text-error-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500/50",
                      showSidebarContent && "pr-3"
                    )}
                    aria-label="Sign out"
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
                </Tooltip.Trigger>
                {isCollapsedDesktop && (
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
                )}
              </Tooltip.Root>
            </div>
          </LayoutGroup>
        </Tooltip.Provider>
      </motion.div>
    </>
  );
};
