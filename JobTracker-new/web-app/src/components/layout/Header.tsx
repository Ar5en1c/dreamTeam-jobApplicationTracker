import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Moon, Sun, Menu, User, Settings, LogOut, Check, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockUserProfile } from '@/lib/mockData';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

const mockNotifications = [
  {
    id: '1',
    title: 'Application Update',
    message: 'Your application to Google has been viewed',
    time: '2 minutes ago',
    type: 'info' as const,
    read: false
  },
  {
    id: '2',
    title: 'Interview Scheduled',
    message: 'Technical interview with Microsoft on Friday at 2 PM',
    time: '1 hour ago',
    type: 'success' as const,
    read: false
  },
  {
    id: '3',
    title: 'Application Deadline',
    message: 'Apple application deadline is tomorrow',
    time: '3 hours ago',
    type: 'warning' as const,
    read: true
  }
];

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply theme on component mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // In a real app, this would trigger search functionality
    console.log('Searching for:', e.target.value);
  };

  const handleNotificationClick = (notificationId: string) => {
    console.log('Notification clicked:', notificationId);
    setShowNotifications(false);
  };

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
        console.log('Logout clicked');
        break;
    }
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-card border-b border-border">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
        onClick={onToggleMobileMenu}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Search */}
      <div className="flex-1 max-w-md mx-4 lg:mx-0">
        <Input
          type="search"
          placeholder="Search applications, companies..."
          leftIcon={<Search className="h-4 w-4" />}
          className="w-full"
          value={searchValue}
          onChange={handleSearch}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 notification-dropdown rounded-lg z-50">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {mockNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    className="w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === 'success' && <Check className="w-4 h-4 text-green-600" />}
                        {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-orange-600" />}
                        {notification.type === 'info' && <Clock className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{notification.title}</p>
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{mockUserProfile.personalInfo.name}</p>
            <p className="text-xs text-muted-foreground">
              {mockUserProfile.experience[0]?.title || 'Job Seeker'}
            </p>
          </div>
          <div className="relative" ref={profileRef}>
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt={mockUserProfile.personalInfo.name}
              fallback={mockUserProfile.personalInfo.name}
              size="default"
              className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 dropdown-background rounded-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{mockUserProfile.personalInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{mockUserProfile.personalInfo.email}</p>
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