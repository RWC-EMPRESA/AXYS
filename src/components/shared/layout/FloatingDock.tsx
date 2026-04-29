'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Plus, FileText, Settings } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Painel', href: '/dashboard' },
  { icon: FileText, label: 'Ordens', href: '/ordens' },
  { icon: Users, label: 'Equipe', href: '/equipe' },
  { icon: Settings, label: 'Ajustes', href: '/configuracoes' },
];

export default function FloatingDock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="glass-panel flex items-center justify-between gap-2 px-4 py-3 rounded-full relative">
        
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          );
        })}

        {/* Central Action Button */}
        <div className="relative -mt-8 mx-2 group">
          <button
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-[0_8px_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_40px_rgba(249,115,22,0.6)] focus:outline-none"
            aria-label="Adicionar OS"
          >
            <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
