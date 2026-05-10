import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '@/features/bookings/hooks/useBooking';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export function ConfirmationPage() {
  const { bookingReference } = useParams<{ bookingReference: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError } = useBooking(bookingReference!);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      </PageContainer>
    );
  }

  if (isError || !booking) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-500">Booking not found.</p>
          <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {/* Success icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Booking Confirmed!</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Your appointment has been booked.</p>

        {/* Reference */}
        <div className="bg-primary-light rounded-lg p-3 text-center mb-4">
          <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
          <p className="text-base font-bold text-primary">{booking.bookingReference}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Branch</span>
            <span className="font-medium text-gray-900">{booking.branch.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-900">
              {new Date(booking.slot.slotDate).toLocaleDateString('en-ZA', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-900">
              {booking.slot.startTime} – {booking.slot.endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium text-gray-900">{booking.customerName}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={() => navigate('/')} fullWidth>
            Book Another Appointment
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}