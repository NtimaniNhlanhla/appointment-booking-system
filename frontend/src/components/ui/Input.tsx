import { FormError } from '../forms/FormError';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full rounded border px-3 py-2.5 text-sm text-gray-900
          placeholder:text-gray-400 transition-colors
          focus:outline-none focus:ring-2
          ${error
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-gray-300 focus:border-primary focus:ring-primary/20'
          }
          ${className}
        `}
        {...rest}
      />
      {error && <FormError id={`${id}-error`} message={error} />}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}