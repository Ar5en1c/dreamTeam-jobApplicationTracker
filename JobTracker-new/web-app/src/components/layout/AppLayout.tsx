import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};

const pageTransition: Transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2,
};

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background text-foreground prevent-overflow">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),transparent_55%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.1),transparent_55%)]" />
        <div className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-primary-500/25 blur-[140px]" />
        <div className="absolute -right-32 bottom-24 h-[420px] w-[420px] rounded-full bg-secondary-500/20 blur-[150px]" />
        <div className="absolute inset-x-12 top-10 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
        <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[repeating-linear-gradient(120deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_18px)]" />
        <div className="absolute inset-0 opacity-35 [mask-image:radial-gradient(70%_65%_at_50%_45%,black,transparent)] bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>

      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 min-w-0 flex-col lg:px-8 lg:py-8">
        {/* Header with glass effect */}
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page Content with unique card-based layout */}
        <main className="relative flex-1 overflow-y-auto">
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 w-[min(92%,72rem)] rounded-full bg-gradient-to-r from-primary-500/20 via-primary-500/5 to-transparent blur-3xl" />
          {/* Content container with page transitions */}
          <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
