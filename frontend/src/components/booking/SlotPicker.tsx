import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { TimeSlotButton } from './TimeSlotButton';
import type { TimeSlot } from '@/features/bookings/types/booking.types';

interface SlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

export function SlotPicker({ slots, selectedSlot, onSelect, isLoading = false }: SlotPickerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <EmptyState
        title="No slots available"
        message="Please select a different date."
      />
    );
  }

  const available = slots.filter((s) => !s.isBooked).length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-500">{available} of {slots.length} slots available</p>

      <div className="grid grid-cols-4 gap-3" role="group" aria-label="Available time slots">
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot.id}
            slot={slot}
            isSelected={selectedSlot?.id === slot.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-gray-300 bg-white inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" />
          Booked
        </span>
      </div>
    </div>
  );
}