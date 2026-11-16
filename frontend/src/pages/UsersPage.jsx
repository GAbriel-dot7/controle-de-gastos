import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Loading from '../components/Loading.jsx';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const loadUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.users || []);
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível carregar usuários.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      setToast({ type: 'success', message: 'Usuário removido com sucesso.' });
      await loadUsers();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível remover o usuário.' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Usuários</h1>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <Loading message="Carregando usuários..." />
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                    {user.role !== 'ADMIN' && (
                      <button type="button" onClick={() => handleDelete(user.id)} className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700">
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
