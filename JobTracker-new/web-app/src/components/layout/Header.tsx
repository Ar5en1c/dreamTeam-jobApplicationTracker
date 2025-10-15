import React from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      {/* LED Lamp Bar Container - At absolute top edge */}
      <div className="relative h-36 w-full">
        {/* The LED Bar itself - At the very top edge */}
        <div className="absolute inset-x-0 top-0 z-10 h-2">
          {/* Single glow layer */}
          <div
            className={cn(
              "absolute inset-0 blur-xl transition-colors duration-500",
              resolvedTheme === "dark"
                ? "bg-gradient-to-r from-amber-400/50 via-yellow-400/60 to-amber-400/50"
                : "bg-gradient-to-r from-cyan-400/50 via-blue-400/60 to-cyan-400/50"
            )}
          />

          {/* Core LED bar */}
          <div
            className={cn(
              "absolute inset-0 transition-colors duration-500",
              resolvedTheme === "dark"
                ? "bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300"
                : "bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300"
            )}
          />
        </div>

        {/* Simplified Light Beams - 3 layers only for performance */}

        {/* Wide ambient light spread */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-screen opacity-20 transition-colors duration-500",
            "bg-gradient-to-b",
            resolvedTheme === "dark"
              ? "from-amber-400/15 via-yellow-400/5 to-transparent"
              : "from-cyan-400/15 via-blue-400/5 to-transparent"
          )}
        />

        {/* Left light cone */}
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 h-[100vh] w-1/2 origin-top-left transition-opacity duration-500",
            "bg-[conic-gradient(from_70deg_at_0%_0%,transparent_0deg,var(--light-color)_15deg,transparent_30deg)]",
            "blur-[60px] opacity-30",
            resolvedTheme === "dark"
              ? "[--light-color:rgba(251,191,36,0.4)]"
              : "[--light-color:rgba(34,211,238,0.4)]"
          )}
        />

        {/* Right light cone */}
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 h-[100vh] w-1/2 origin-top-right transition-opacity duration-500",
            "bg-[conic-gradient(from_290deg_at_100%_0%,transparent_0deg,var(--light-color)_15deg,transparent_30deg)]",
            "blur-[60px] opacity-30",
            resolvedTheme === "dark"
              ? "[--light-color:rgba(251,191,36,0.4)]"
              : "[--light-color:rgba(34,211,238,0.4)]"
          )}
        />

        {/* Mobile menu button (mobile only) - Bottom left */}
        <motion.button
          className={cn(
            "pointer-events-auto absolute bottom-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl",
            "border transition-all duration-200 lg:hidden",
            "backdrop-blur-md shadow-lg",
            resolvedTheme === "dark"
              ? "border-slate-700/50 bg-slate-800/50 text-slate-300 hover:border-primary-400/50 hover:bg-primary-500/10 hover:text-primary-400"
              : "border-slate-300/50 bg-white/50 text-slate-700 hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-600"
          )}
          onClick={onToggleMobileMenu}
          aria-label="Toggle mobile menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        {/* Quarter Sun/Moon Toggle - Top right corner - Optimized for performance */}
        <button
          onClick={toggleTheme}
          className="pointer-events-auto fixed right-0 top-0 z-50 h-16 w-16 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          aria-label={
            resolvedTheme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {/* Sun Quarter (light mode) - Swapped: Blue for light mode */}
          <div
            className={cn(
              "absolute right-0 top-0 h-16 w-16 transition-opacity duration-300",
              resolvedTheme === "light" ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2">
              {/* Single glow layer */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/50 via-blue-400/40 to-cyan-500/30 blur-lg" />

              {/* Main arc - Blue theme */}
              <div className="absolute inset-0 rounded-full border-[5px] border-transparent bg-gradient-to-br from-cyan-300 via-blue-300 to-cyan-400 bg-clip-border" />

              {/* Simple rays */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {[215, 270, 325].map((rotation) => (
                  <div
                    key={rotation}
                    className="absolute left-0 top-0 h-1 w-6 origin-left bg-gradient-to-r from-cyan-300 to-transparent rounded-full"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      marginLeft: "64px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Moon Quarter (dark mode) - Swapped: Yellow for dark mode */}
          <div
            className={cn(
              "absolute right-0 top-0 h-16 w-16 transition-opacity duration-300",
              resolvedTheme === "dark" ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2">
              {/* Single glow layer */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300/50 via-yellow-400/40 to-amber-500/30 blur-lg" />

              {/* Main arc - Yellow theme */}
              <div className="absolute inset-0 rounded-full border-[5px] border-transparent bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-400 bg-clip-border" />

              {/* Simple craters */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute bottom-8 left-10 h-2.5 w-2.5 rounded-full bg-amber-500/30" />
                <div className="absolute bottom-11 left-13 h-1.5 w-1.5 rounded-full bg-amber-500/25" />
              </div>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
