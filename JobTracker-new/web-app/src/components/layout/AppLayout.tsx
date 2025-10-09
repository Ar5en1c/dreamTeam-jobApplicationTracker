import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background prevent-overflow">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface-2">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
