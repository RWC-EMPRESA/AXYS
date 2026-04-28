import LoginForm from '@/components/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="w-full">
      <div className="glass-panel rounded-2xl p-8 sm:p-10">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-white/10 shadow-lg mb-4">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">AX</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            OS Manager
          </h1>
          <p className="text-sm text-gray-400">
            Entre com suas credenciais para acessar o painel.
          </p>
        </div>

        <LoginForm />
        
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          OS Manager Digital &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
