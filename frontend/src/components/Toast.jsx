export default function Toast({ message, type = 'success', onClose }) {
  const palette = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-rose-200 bg-rose-50 text-rose-700',
    info: 'border-sky-200 bg-sky-50 text-sky-700',
  };

  return (
    <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-xl border px-4 py-3 shadow-lg ${palette[type]}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium">{message}</p>
        <button type="button" onClick={onClose} className="text-sm font-semibold opacity-70">×</button>
      </div>
    </div>
  );
}
