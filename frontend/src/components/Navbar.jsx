import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Despesas' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/meses', label: 'Meses' },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-100 px-2 py-1 text-sm font-bold text-sky-700">€</div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Controle de gastos</p>
            <p className="text-xs text-slate-500">{user?.name}</p>
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-sky-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'ADMIN' && (
            <NavLink to="/usuarios" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-sky-700' : 'text-slate-600 hover:text-slate-900'}`}>
              Usuários
            </NavLink>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
