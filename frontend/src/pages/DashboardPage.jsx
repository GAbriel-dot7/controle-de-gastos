import { useContext, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import ExpenseFormModal from '../components/ExpenseFormModal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const currentDate = new Date();
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [closedMonths, setClosedMonths] = useState([]);
  const [summary, setSummary] = useState({ totalPaid: 0, totalPending: 0, total: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filter, setFilter] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    categoryId: '',
    paymentStatus: '',
  });
  const [toast, setToast] = useState(null);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  const currentMonthClosed = useMemo(
    () => closedMonths.some((item) => Number(item.month) === Number(filter.month) && Number(item.year) === Number(filter.year)),
    [closedMonths, filter.month, filter.year],
  );

  const loadCategories = async () => {
    const response = await api.get('/api/categories');
    setCategories(response.data.categories);
  };

  const loadClosedMonths = async () => {
    const response = await api.get('/api/months');
    setClosedMonths(response.data.months || []);
  };

  const loadExpenses = async () => {
    const params = {
      month: filter.month,
      year: filter.year,
      categoryId: filter.categoryId || undefined,
      paymentStatus: filter.paymentStatus || undefined,
    };
    const response = await api.get('/api/expenses', { params });
    setExpenses(response.data.expenses || []);
  };

  const loadSummary = async () => {
    const response = await api.get('/api/expenses/summary', {
      params: {
        month: filter.month,
        year: filter.year,
      },
    });
    setSummary(response.data.summary || { totalPaid: 0, totalPending: 0, total: 0, byCategory: [] });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        await Promise.all([loadCategories(), loadClosedMonths(), loadExpenses(), loadSummary()]);
      } catch (error) {
        setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível conectar ao servidor.' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filter.month, filter.year, filter.categoryId, filter.paymentStatus]);

  const refreshAll = async () => {
    await Promise.all([loadCategories(), loadClosedMonths(), loadExpenses(), loadSummary()]);
  };

  const handleSubmitExpense = async (payload) => {
    setIsSubmittingExpense(true);

    try {
      if (selectedExpense) {
        await api.put(`/api/expenses/${selectedExpense.id}`, payload);
        setToast({ type: 'success', message: 'Despesa atualizada com sucesso.' });
      } else {
        await api.post('/api/expenses', payload);
        setToast({ type: 'success', message: 'Despesa criada com sucesso.' });
      }
      setModalOpen(false);
      setSelectedExpense(null);
      await refreshAll();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Erro ao salvar despesa.' });
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await api.delete(`/api/expenses/${selectedExpense.id}`);
      setToast({ type: 'success', message: 'Despesa removida com sucesso.' });
      setRemoveModalOpen(false);
      setSelectedExpense(null);
      await refreshAll();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível excluir a despesa.' });
    }
  };

  const handleTogglePaid = async (expense) => {
    try {
      const nextStatus = expense.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
      await api.patch(`/api/expenses/${expense.id}/status`, { paymentStatus: nextStatus });
      setToast({ type: 'success', message: 'Status da despesa atualizado.' });
      await refreshAll();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível atualizar o status.' });
    }
  };

  const handleCloseMonth = async () => {
    try {
      await api.post('/api/months/close', { month: filter.month, year: filter.year });
      setToast({ type: 'success', message: `Mês ${filter.month}/${filter.year} encerrado com sucesso.` });
      await refreshAll();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível encerrar o mês.' });
    }
  };

  const handleReopenMonth = async (month, year) => {
    try {
      await api.delete(`/api/months/${year}/${month}`);
      setToast({ type: 'info', message: `Mês ${month}/${year} reaberto.` });
      await refreshAll();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível reabrir o mês.' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Despesas</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setSelectedExpense(null); setModalOpen(true); }} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700">
              Nova despesa
            </button>
            <button type="button" onClick={handleCloseMonth} disabled={currentMonthClosed} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-55">
              {currentMonthClosed ? 'Mês encerrado' : 'Encerrar mês'}
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Pago</p>
            <p className="mt-2 text-2xl font-bold text-emerald-800">{currency.format(summary.totalPaid)}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Pendente</p>
            <p className="mt-2 text-2xl font-bold text-amber-800">{currency.format(summary.totalPending)}</p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm text-sky-700">Total</p>
            <p className="mt-2 text-2xl font-bold text-sky-800">{currency.format(summary.total)}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
          <select value={filter.month} onChange={(event) => setFilter((prev) => ({ ...prev, month: Number(event.target.value) }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
          <input type="number" min="2000" value={filter.year} onChange={(event) => setFilter((prev) => ({ ...prev, year: Number(event.target.value) }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <select value={filter.categoryId} onChange={(event) => setFilter((prev) => ({ ...prev, categoryId: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">Todas as categorias</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <select value={filter.paymentStatus} onChange={(event) => setFilter((prev) => ({ ...prev, paymentStatus: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">Todos os status</option>
            <option value="PAID">Pago</option>
            <option value="PENDING">Pendente</option>
          </select>
        </div>

        {loading ? (
          <Loading message="Carregando despesas..." />
        ) : expenses.length === 0 ? (
          <EmptyState title="Nenhuma despesa encontrada" description="Cadastre sua primeira despesa ou altere os filtros de pesquisa." actionLabel="Nova despesa" onAction={() => setModalOpen(true)} />
        ) : (
          <ExpenseTable expenses={expenses} monthClosed={currentMonthClosed} onEdit={(expense) => { setSelectedExpense(expense); setModalOpen(true); }} onDelete={(expense) => { setSelectedExpense(expense); setRemoveModalOpen(true); }} onTogglePaid={handleTogglePaid} />
        )}

        <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Meses encerrados</h2>
          </div>
          {closedMonths.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum mês encerrado.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {closedMonths.map((month) => (
                <button key={`${month.year}-${month.month}`} type="button" onClick={() => handleReopenMonth(month.month, month.year)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300">
                  {month.month}/{month.year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ExpenseFormModal
        open={modalOpen}
        initialValues={selectedExpense ? {
          ...selectedExpense,
          dueDate: new Date(selectedExpense.dueDate).toISOString(),
          categoryId: selectedExpense.categoryId,
          amount: selectedExpense.amount,
        } : null}
        categories={categories}
        onClose={() => { setModalOpen(false); setSelectedExpense(null); }}
        onSubmit={handleSubmitExpense}
        isSubmitting={isSubmittingExpense}
      />

      <ConfirmModal
        open={removeModalOpen}
        title="Excluir despesa"
        message={`Deseja realmente remover ${selectedExpense?.description || 'esta despesa'}?`}
        confirmLabel="Excluir"
        onCancel={() => { setRemoveModalOpen(false); setSelectedExpense(null); }}
        onConfirm={handleDeleteExpense}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
