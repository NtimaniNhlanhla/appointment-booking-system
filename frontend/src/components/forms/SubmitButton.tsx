import { Button } from '../ui/Button';

interface SubmitButtonProps {
  isSubmitting?: boolean;
  label?: string;
  fullWidth?: boolean;
}

export function SubmitButton({
  isSubmitting = false,
  label = 'Submit',
  fullWidth = true,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      isLoading={isSubmitting}
      fullWidth={fullWidth}
      disabled={isSubmitting}
    >
      {label}
    </Button>
  );
}