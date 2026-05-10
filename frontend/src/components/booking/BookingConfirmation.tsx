import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import type { Booking } from '@/features/bookings/types/booking.types';

interface BookingConfirmationProps {
  booking: Booking;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const formattedDate = format(new Date(booking.slot.slotDate), 'EEEE, d MMMM yyyy');

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Success header */}
      <div className="bg-success px-5 py-6 text-white text-center">
        <div className="text-4xl mb-2" aria-hidden="true">✓</div>
        <h1 className="text-lg font-semibold">Booking Confirmed!</h1>
        <p className="text-sm opacity-90 mt-1">
          A confirmation email has been sent to {booking.customerEmail}
        </p>
      </div>

      {/* Reference badge */}
      <div className="flex justify-center -mt-4 mb-2">
        <Badge variant="primary" label={`Ref: ${booking.bookingReference}`} className="px-4 py-1.5 text-sm shadow" />
      </div>

      {/* Details */}
      <div className="px-5 pb-5">
        <Row label="Branch" value={booking.branch.name} />
        <Row label="Date" value={formattedDate} />
        <Row label="Time" value={`${booking.slot.startTime} – ${booking.slot.endTime}`} />
        <Row label="Name" value={booking.customerName} />
        <Row label="Email" value={booking.customerEmail} />
        {booking.customerPhone && (
          <Row label="Phone" value={booking.customerPhone} />
        )}
        {booking.notes && (
          <Row label="Notes" value={booking.notes} />
        )}
      </div>
    </div>
  );
}