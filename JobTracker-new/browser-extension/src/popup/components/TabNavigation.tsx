import React from 'react';
import { Home, Briefcase, PlusCircle, Settings } from 'lucide-react';
import { cn } from '@jobtracker/ui';

export type TabId = 'dashboard' | 'applications' | 'capture' | 'settings';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'applications', label: 'Applications', icon: Briefcase },
  { id: 'capture', label: 'Add', icon: PlusCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  notificationCounts?: Partial<Record<TabId, number>>;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  notificationCounts = {},
}) => {
  return (
    <nav
      className="flex items-center justify-around border-t border-borderMuted bg-surface-1/95 backdrop-blur-md flex-shrink-0"
      role="tablist"
      aria-label="Main navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = notificationCounts[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-1 py-3 px-2 transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
              isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )}
              />
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    'absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center',
                    'rounded-full bg-error-600 px-1 text-[0.625rem] font-semibold text-white',
                    'ring-2 ring-surface-1'
                  )}
                  aria-label={`${count} notification${count > 1 ? 's' : ''}`}
                >
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </div>
            <span
              className={cn(
                'text-[0.625rem] font-medium leading-none transition-all duration-200',
                isActive && 'font-semibold'
              )}
            >
              {tab.label}
            </span>
            {isActive && (
              <span
                className="absolute top-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-primary-600 dark:bg-primary-400"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
