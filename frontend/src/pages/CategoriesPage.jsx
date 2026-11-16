import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const loadCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível carregar categorias.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setEditingCategoryId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setToast({ type: 'error', message: 'Informe o nome da categoria.' });
      return;
    }

    try {
      if (editingCategoryId) {
        await api.put(`/api/categories/${editingCategoryId}`, { name: trimmedName });
        setToast({ type: 'success', message: 'Categoria atualizada com sucesso.' });
      } else {
        await api.post('/api/categories', { name: trimmedName });
        setToast({ type: 'success', message: 'Categoria criada com sucesso.' });
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Não foi possível salvar a categoria.',
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.id);
    setName(category.name);
  };

  const handleDelete = async (categoryId) => {
    try {
      await api.delete(`/api/categories/${categoryId}`);
      setToast({ type: 'success', message: 'Categoria removida com sucesso.' });
      if (editingCategoryId === categoryId) {
        resetForm();
      }
      await loadCategories();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível remover a categoria.' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Categorias</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            {loading ? (
              <Loading message="Carregando categorias..." />
            ) : categories.length === 0 ? (
              <EmptyState title="Nenhuma categoria cadastrada" description="Crie uma categoria para organizar suas despesas." />
            ) : (
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                    <span className="font-medium text-slate-700">{category.name}</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(category)} className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700">
                        Editar
                      </button>
                      <button type="button" onClick={() => handleDelete(category.id)} className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700">
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">{editingCategoryId ? 'Editar categoria' : 'Nova categoria'}</h2>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
              <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="flex-1 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700">
                {editingCategoryId ? 'Atualizar categoria' : 'Salvar categoria'}
              </button>
              {editingCategoryId && (
                <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
