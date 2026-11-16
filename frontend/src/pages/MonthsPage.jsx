import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Loading from '../components/Loading.jsx';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';

export default function MonthsPage() {
  const currentDate = new Date();
  const [months, setMonths] = useState([]);
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const loadMonths = async () => {
    try {
      const response = await api.get('/api/months');
      setMonths(response.data.months || []);
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível carregar os meses.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonths();
  }, []);

  const handleCloseMonth = async (event) => {
    event.preventDefault();
    try {
      await api.post('/api/months/close', { month, year });
      setToast({ type: 'success', message: `Mês ${month}/${year} encerrado com sucesso.` });
      await loadMonths();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível encerrar o mês.' });
    }
  };

  const handleReopen = async (monthValue, yearValue) => {
    try {
      await api.delete(`/api/months/${yearValue}/${monthValue}`);
      setToast({ type: 'info', message: `Mês ${monthValue}/${yearValue} reaberto.` });
      await loadMonths();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Não foi possível reabrir o mês.' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Meses</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleCloseMonth} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Encerrar mês</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mês</label>
                <select value={month} onChange={(event) => setMonth(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5">
                  {[...Array(12)].map((_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Ano</label>
                <input type="number" value={year} onChange={(event) => setYear(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
              </div>
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600">
              Encerrar mês
            </button>
          </form>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Meses encerrados</h2>
            {loading ? (
              <Loading message="Carregando meses..." />
            ) : months.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Nenhum mês encerrado.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {months.map((item) => (
                  <li key={`${item.year}-${item.month}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <span className="font-medium text-slate-700">{item.month}/{item.year}</span>
                    <button type="button" onClick={() => handleReopen(item.month, item.year)} className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700">
                      Reabrir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
