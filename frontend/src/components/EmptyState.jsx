export default function EmptyState({ title, message }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}
