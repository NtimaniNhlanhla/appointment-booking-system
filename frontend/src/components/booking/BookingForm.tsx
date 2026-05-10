import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingFormValues } from '@/features/bookings/validation/booking.schema';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Button } from '@/components/ui/Button';

interface BookingFormProps {
  onSubmit: (values: BookingFormValues) => void;
  isSubmitting: boolean;
  onBack?: () => void;
}

export function BookingForm({ onSubmit, isSubmitting, onBack }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>

      <Input
        id="customerName"
        label="Full Name"
        placeholder="e.g. Thabo Nkosi"
        error={errors.customerName?.message}
        {...register('customerName')}
      />

      <Input
        id="customerEmail"
        type="email"
        label="Email Address"
        placeholder="e.g. thabo@email.com"
        error={errors.customerEmail?.message}
        {...register('customerEmail')}
      />

      <Input
        id="customerPhone"
        type="tel"
        label="Phone Number"
        placeholder="e.g. 082 123 4567"
        error={errors.customerPhone?.message}
        {...register('customerPhone')}
      />

      <Textarea
        id="notes"
        label="Notes (optional)"
        placeholder="Any special requirements..."
        error={errors.notes?.message}
        {...register('notes')}
      />

      <SubmitButton isSubmitting={isSubmitting} label="Confirm Booking" />

      {onBack && (
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={onBack}
          disabled={isSubmitting}
        >
          ← Back
        </Button>
      )}
    </form>
  );
}