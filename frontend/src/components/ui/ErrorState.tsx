interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <span className="text-4xl">⚠️</span>
      <p className="text-base font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}