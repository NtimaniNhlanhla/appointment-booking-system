import type { TimeSlot } from '@/features/bookings/types/booking.types';

interface TimeSlotButtonProps {
  slot: TimeSlot;
  isSelected: boolean;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotButton({ slot, isSelected, onSelect }: TimeSlotButtonProps) {
  const isBooked = slot.isBooked;

  return (
    <button
      type="button"
      disabled={isBooked}
      aria-label={`Select ${slot.startTime} to ${slot.endTime}`}
      aria-disabled={isBooked}
      aria-pressed={isSelected}
      onClick={() => !isBooked && onSelect(slot)}
      className={`
        py-2 px-1 rounded text-xs font-medium text-center transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary/40
        ${isBooked
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