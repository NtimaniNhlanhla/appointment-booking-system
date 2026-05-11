import type { TimeSlot } from '@/features/bookings/types/booking.types';

interface TimeSlotButtonProps {
  slot: TimeSlot;
  isSelected: boolean;
  onSelect: (slot: TimeSlot) => void;
  date: string; // "YYYY-MM-DD"
}

function isSlotInPast(date: string, startTime: string): boolean {
  // Combine date + startTime into a local datetime and compare to now
  const slotDateTime = new Date(`${date}T${startTime}:00`);
  return slotDateTime <= new Date();
}

export function TimeSlotButton({ slot, isSelected, onSelect, date }: TimeSlotButtonProps) {
  const isBooked = slot.isBooked;
  const isPast = isSlotInPast(date, slot.startTime);
  const isDisabled = isBooked || isPast;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-label={`${slot.startTime} to ${slot.endTime}${isPast ? ' (past)' : isBooked ? ' (booked)' : ''}`}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
      onClick={() => !isDisabled && onSelect(slot)}
      className={`
        py-2 px-1 rounded text-xs font-medium text-center transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary/40
        ${isDisabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300'
          : isSelected
            ? 'bg-primary text-white ring-2 ring-primary/40'
            : 'bg-white border border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary-light'
        }
      `}
    >
      {slot.startTime}
    </button>
  );
}