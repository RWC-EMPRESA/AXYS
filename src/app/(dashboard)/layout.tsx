import React from 'react';
import Header from '@/components/shared/layout/Header';
import FloatingDock from '@/components/shared/layout/FloatingDock';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden pb-24">
      {/* Glow Effects sutis ao fundo para o Dashboard todo */}
      <div className="fixed top-0 left-1/4 w-[50vw] h-[30vh] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[40vw] h-[40vh] bg-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {children}
      </main>

      {/* Floating macOS Dock */}
      <FloatingDock />
    </div>
  );
}
