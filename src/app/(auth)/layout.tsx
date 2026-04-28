import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Entrar - OS Manager Digital',
  description: 'Acesse o painel do OS Manager Digital.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Orbs / Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-md px-6">
        {children}
      </div>
    </div>
  );
}
