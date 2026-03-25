export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-center gap-3">
        <span className="text-red-500 text-xl">⚠️</span>
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
