import { redirect } from 'next/navigation';

export default function Home() {
  // Redirecionar diretamente para a página de login por padrão.
  // No futuro, se houver uma landing page, o redirecionamento pode ir para lá.
  redirect('/login');
}
