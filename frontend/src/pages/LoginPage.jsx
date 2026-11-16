import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl font-bold text-sky-700">€</div>
          <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
          <p className="mt-2 text-sm text-slate-600">Acompanhe suas despesas com mais clareza.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Senha</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Ainda não tem conta?{' '}
          <Link to="/register" className="font-semibold text-sky-700">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
