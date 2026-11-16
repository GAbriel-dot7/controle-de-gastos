import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Página não encontrada</h1>
        <p className="mt-2 text-slate-600">A rota acessada não existe ou foi removida.</p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
