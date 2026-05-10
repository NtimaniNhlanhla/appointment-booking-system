interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  onClose?: () => void;
  className?: string;
}

const variantClasses = {
  success: 'bg-success-light text-success border border-success/20',
  error:   'bg-danger-light text-danger border border-danger/20',
  warning: 'bg-amber-50 text-warning border border-warning/20',
  info:    'bg-primary-light text-primary border border-primary/20',
};

const icons = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

export function Alert({ variant, message, title, onClose, className = '' }: AlertProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg p-3 ${variantClasses[variant]} ${className}`}
    >
      <span className="flex-shrink-0 text-sm font-semibold mt-0.5">{icons[variant]}</span>
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="flex-shrink-0 opacity-60 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}