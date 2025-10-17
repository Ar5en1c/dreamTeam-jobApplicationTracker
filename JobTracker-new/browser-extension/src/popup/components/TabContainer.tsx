import React from 'react';
import type { TabId } from './TabNavigation';

interface TabPanelProps {
  id: TabId;
  activeTab: TabId;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ id, activeTab, children }) => {
  const isActive = activeTab === id;

  return (
    <div
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      className="flex-1 overflow-y-auto"
    >
      {isActive && children}
    </div>
  );
};

interface TabContainerProps {
  children: React.ReactNode;
}

export const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  return (
    <div className="flex h-[600px] flex-col bg-surface-1 overflow-hidden">
      {children}
    </div>
  );
};
