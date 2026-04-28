'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (globalError) setGlobalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Bypass absoluto para o Rafael testar o visual do Dashboard
    window.location.href = '/dashboard';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {globalError && (
        <div className="p-3 mb-4 rounded-lg bg-danger/10 border border-danger/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{globalError}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          E-mail
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="rafael@rwcdigital.com"
            value={formData.email}
            onChange={handleChange}
            className={`glass-input ${errors.email ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={`glass-input pr-10 ${errors.password ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black/50 text-primary focus:ring-primary focus:ring-offset-0" />
          <span className="text-xs text-gray-400">Lembrar de mim</span>
        </label>
        <a href="#" className="text-xs text-primary hover:text-primary-hover transition-colors">
          Esqueceu a senha?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Autenticando...</span>
          </>
        ) : (
          <span>Entrar no Sistema</span>
        )}
      </button>
      
    </form>
  );
}
