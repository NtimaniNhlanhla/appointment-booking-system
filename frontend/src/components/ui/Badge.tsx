interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'neutral' | 'primary';
  dot?: boolean;
  className?: string;
}

const variantClasses = {
  success: 'bg-success-light text-success',
  warning: 'bg-amber-50 text-warning',
  neutral: 'bg-gray-100 text-gray-600',
  primary: 'bg-primary-light text-primary',
};

const dotColours = {
  success: 'bg-success',
  warning: 'bg-warning',
  neutral: 'bg-gray-400',
  primary: 'bg-primary',
};

export function Badge({ label, variant = 'neutral', dot = false, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColours[variant]}`} />}
      {label}
    </span>
  );
}