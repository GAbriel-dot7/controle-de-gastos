import { useEffect, useState } from 'react';

export default function ExpenseFormModal({ open, initialValues, categories, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    dueDate: '',
    categoryId: '',
    paymentStatus: 'PENDING',
  });

  useEffect(() => {
    if (open) {
      setForm({
        description: initialValues?.description || '',
        amount: initialValues?.amount ?? '',
        dueDate: initialValues?.dueDate ? initialValues.dueDate.slice(0, 10) : '',
        categoryId: initialValues?.categoryId || categories[0]?.id || '',
        paymentStatus: initialValues?.paymentStatus || 'PENDING',
      });
    }
  }, [open, initialValues, categories]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">{initialValues ? 'Editar despesa' : 'Nova despesa'}</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
            <input name="description" value={form.description} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2" required />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Valor (R$)</label>
              <input name="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Data</label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2" required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Categoria</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2" required>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2">
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Salvando...' : initialValues ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
