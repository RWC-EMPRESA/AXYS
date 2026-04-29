'use client';

import React, { useState } from 'react';
import { Search, Bell, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } finally {
      // Redireciona independente de sucesso/falha na API
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/60 border-b border-white/5 px-6 lg:px-12 py-4 flex items-center justify-between transition-all">
      
      {/* Brand / Logo Area */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-xs tracking-wider">AX</span>
        </div>
        <span className="font-semibold text-foreground tracking-tight hidden sm:block">
          OS Manager
        </span>
      </div>

      {/* Search Bar - Centralized on larger screens */}
      <div className="flex-1 max-w-md px-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Pesquisar OS, técnicos, clientes..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(249,115,22,0.8)] border-2 border-background" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">Rafael Front</p>
            <p className="text-xs text-gray-500">Desenvolvedor</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface border border-white/10 overflow-hidden flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors">
            <span className="text-sm font-bold text-primary">RF</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sair do sistema"
          className="p-2 text-gray-400 hover:text-danger transition-colors rounded-full hover:bg-danger/10 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sair do sistema"
        >
          {isLoggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
        </button>

      </div>
    </header>
  );
}
