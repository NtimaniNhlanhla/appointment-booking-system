interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      {icon ?? <span className="text-4xl text-gray-300">📭</span>}
      <p className="text-base font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 text-sm text-primary hover:underline font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}