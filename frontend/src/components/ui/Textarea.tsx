import { FormError } from '../forms/FormError';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, id, className = '', ...rest }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={3}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full rounded border px-3 py-2.5 text-sm text-gray-900
          placeholder:text-gray-400 transition-colors resize-none
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