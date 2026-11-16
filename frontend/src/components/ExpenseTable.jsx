export default function ExpenseTable({ expenses, onEdit, onDelete, onTogglePaid, monthClosed }) {
  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Descrição</th>
            <th className="px-4 py-3 font-semibold">Categoria</th>
            <th className="px-4 py-3 font-semibold">Data</th>
            <th className="px-4 py-3 font-semibold">Valor</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-800">{expense.description}</td>
              <td className="px-4 py-3 text-slate-600">{expense.category?.name}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(expense.dueDate).toLocaleDateString('pt-BR')}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{currency.format(expense.amount)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${expense.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {expense.paymentStatus === 'PAID' ? 'Pago' : 'Pendente'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={monthClosed}
                    title={monthClosed ? 'Mês encerrado. Não é possível alterar.' : 'Marcar como pago'}
                    onClick={() => onTogglePaid(expense)}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {expense.paymentStatus === 'PAID' ? 'Pendente' : 'Pago'}
                  </button>
                  <button
                    type="button"
                    disabled={monthClosed}
                    title={monthClosed ? 'Mês encerrado. Não é possível alterar.' : 'Editar despesa'}
                    onClick={() => onEdit(expense)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={monthClosed}
                    title={monthClosed ? 'Mês encerrado. Não é possível alterar.' : 'Excluir despesa'}
                    onClick={() => onDelete(expense)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
