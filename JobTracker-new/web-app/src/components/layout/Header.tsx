import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

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
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-surface-1 border-b border-borderMuted">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
        onClick={onToggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Logo/Title for mobile */}
      <div className="lg:hidden flex-1 text-center">
        <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Job Tracker
        </h1>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block flex-1" />

      {/* Right side */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10"
          aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-muted-foreground">Job Seeker</p>
          </div>
          <div className="relative" ref={profileRef}>
            <Avatar
              src={user?.user_metadata?.avatar_url}
              alt={user?.email || 'User'}
              fallback={user?.email?.substring(0, 2).toUpperCase() || 'U'}
              size="default"
              className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 dropdown-background rounded-lg z-50 shadow-lg border border-border">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted text-left transition-colors"
                    onClick={() => handleProfileAction('profile')}
                  >
                    <User className="w-4 h-4 mr-3" />
                    View Profile
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted text-left transition-colors"
                    onClick={() => handleProfileAction('settings')}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted text-red-600 text-left transition-colors"
                    onClick={() => handleProfileAction('logout')}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
