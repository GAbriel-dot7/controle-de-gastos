export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
