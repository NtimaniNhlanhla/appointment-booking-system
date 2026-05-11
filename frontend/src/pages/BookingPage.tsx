import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBranch } from '@/features/bookings/api/branchApi';
import { useSlots } from '@/features/bookings/hooks/useSlots';
import { useCreateBooking } from '@/features/bookings/hooks/useCreateBooking';
import { PageContainer } from '@/components/layout/PageContainer';
import { StepIndicator } from '@/components/booking/StepIndicator';
import { Calendar } from '@/components/booking/Calendar';
import { SlotPicker } from '@/components/booking/SlotPicker';
import { BookingForm } from '@/components/booking/BookingForm';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { TimeSlot } from '@/features/bookings/types/booking.types';
import type { BookingFormValues } from '@/features/bookings/validation/booking.schema';

type Step = 2 | 3 | 4;

export function BookingPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(2);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const { data: branch, isLoading: branchLoading } = useQuery({
    queryKey: ['branch', branchId],
    queryFn: () => getBranch(branchId!),
    enabled: !!branchId,
  });

  const { data: slots = [], isLoading: slotsLoading } = useSlots(branchId!, selectedDate);

  const mutation = useCreateBooking(branchId!, selectedDate);

  const goNext = () => setStep((prev) => (prev + 1) as Step);
  const goBack = () => {
    if (step === 2) navigate('/');
    else setStep((prev) => (prev - 1) as Step);
  };

  const handleFormSubmit = (values: BookingFormValues) => {
    if (!selectedSlot) return;
    mutation.mutate({
      slotId: selectedSlot.id,
      branchId: branchId!,
      ...values,
    });
  };

  if (branchLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <StepIndicator currentStep={step} />

      {branch && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{branch.name}</h2>
          <p className="text-sm text-gray-500">{branch.address}</p>
        </div>
      )}

      {step === 2 && (
        <>
          <p className="text-sm text-gray-500 mb-4">Select an appointment date</p>
          <Calendar
            selectedDate={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d);
              setSelectedSlot(null);
              goNext();
            }}
          />
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-sm text-gray-500 mb-4">Select an available time</p>
          {slotsLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <SlotPicker
              slots={slots}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
              date={selectedDate}
            />
          )}
          <Alert variant="info" message="Each appointment is 30 minutes" className="mt-4" />
          <Button
            onClick={goNext}
            disabled={!selectedSlot}
            fullWidth
            className="mt-4"
          >
            Continue
          </Button>
        </>
      )}

      {step === 4 && (
        <BookingForm
          onSubmit={handleFormSubmit}
          isSubmitting={mutation.isPending}
          onBack={goBack}
        />
      )}

      {step !== 4 && (
        <button
          onClick={goBack}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
      )}
    </PageContainer>
  );
}