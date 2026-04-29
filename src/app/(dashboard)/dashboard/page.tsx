import React from 'react';
import { Activity, Clock, CheckCircle2, MoreHorizontal } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
          Visão Geral
        </h1>
        <p className="text-gray-400 text-sm">
          Bem-vindo de volta, Rafael. Aqui estão os números de hoje.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1 */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-warning/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pendentes</h3>
          <p className="text-4xl font-bold text-white mb-4">12</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
            <span className="text-gray-500">+2 hoje</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Em Andamento</h3>
          <p className="text-4xl font-bold text-white mb-4">08</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            <span className="text-gray-500">Equipes ativas</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Concluídas</h3>
          <p className="text-4xl font-bold text-white mb-4">145</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            <span className="text-gray-500">Essa semana</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tempo Médio</h3>
          <p className="text-4xl font-bold text-white mb-4">2.4h</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span className="text-gray-500">-15% vs mês ant.</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico/Lista Esquerda (Larger space) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">Ordens Recentes</h2>
              <button className="text-sm text-primary hover:text-white transition-colors">Ver todas &gt;</button>
            </div>
            
            {/* Tabela Mock */}
            <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <p className="text-sm text-gray-500">Tabela de ordens recentes (Integração Backend PENDENTE)</p>
            </div>
          </div>
        </div>

        {/* Sidebar Direita (Atividades) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-2xl p-6 min-h-[300px]">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                Atividades
              </h2>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Linha do tempo mock */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-success">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">OS #103 Concluída</span>
                    <span className="text-xs text-gray-500">Agora</span>
                  </div>
                  <p className="text-xs text-gray-400">Roberto finalizou o reparo. Laudo anexado.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">Check-in</span>
                    <span className="text-xs text-gray-500">15 min</span>
                  </div>
                  <p className="text-xs text-gray-400">Carlos chegou ao local: Rua das Flores.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
