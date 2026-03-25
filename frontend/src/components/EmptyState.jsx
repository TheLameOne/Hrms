export default function EmptyState({ title, message }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-500">{message}</p>
    </div>
  )
}
