import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface FormFieldProps {
  as?: 'input' | 'textarea';
  label: string;
  id: string;
  error?: string;
  hint?: string;
  [key: string]: unknown;
}

export function FormField({ as = 'input', ...props }: FormFieldProps) {
  if (as === 'textarea') {
    return <Textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string; hint?: string })} />;
  }
  return <Input {...(props as React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hint?: string })} />;
}