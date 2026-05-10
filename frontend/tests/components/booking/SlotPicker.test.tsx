import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SlotPicker } from '@/components/booking/SlotPicker';
import type { TimeSlot } from '@/features/bookings/types/booking.types';

const makeSlot = (overrides: Partial<TimeSlot> = {}): TimeSlot => ({
  id: 'slot-1',
  branchId: 'branch-1',
  slotDate: '2026-12-01',
  startTime: '08:00',
  endTime: '08:30',
  isBooked: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

const availableSlot = makeSlot({ id: 'slot-1', startTime: '08:00', endTime: '08:30' });
const bookedSlot = makeSlot({ id: 'slot-2', startTime: '08:30', endTime: '09:00', isBooked: true });

describe('SlotPicker', () => {
  it('renders list of available slots', () => {
    render(
      <SlotPicker slots={[availableSlot]} selectedSlot={null} onSelect={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /08:00 to 08:30/i })).toBeInTheDocument();
  });

  it('renders booked slots as disabled', () => {
    render(
      <SlotPicker slots={[bookedSlot]} selectedSlot={null} onSelect={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /08:30 to 09:00/i })).toBeDisabled();
  });

  it('calls onSelect when available slot is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SlotPicker slots={[availableSlot]} selectedSlot={null} onSelect={onSelect} />
    );
    await user.click(screen.getByRole('button', { name: /08:00 to 08:30/i }));
    expect(onSelect).toHaveBeenCalledWith(availableSlot);
  });

  it('does not call onSelect when booked slot is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SlotPicker slots={[bookedSlot]} selectedSlot={null} onSelect={onSelect} />
    );
    await user.click(screen.getByRole('button', { name: /08:30 to 09:00/i }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('highlights the selected slot', () => {
    render(
      <SlotPicker slots={[availableSlot]} selectedSlot={availableSlot} onSelect={vi.fn()} />
    );
    const btn = screen.getByRole('button', { name: /08:00 to 08:30/i });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows empty state when slots array is empty', () => {
    render(
      <SlotPicker slots={[]} selectedSlot={null} onSelect={vi.fn()} />
    );
    expect(screen.getByText(/no slots available/i)).toBeInTheDocument();
  });

  it('all booked slots have aria-disabled="true"', () => {
    render(
      <SlotPicker slots={[availableSlot, bookedSlot]} selectedSlot={null} onSelect={vi.fn()} />
    );
    const bookedBtn = screen.getByRole('button', { name: /08:30 to 09:00/i });
    expect(bookedBtn).toHaveAttribute('aria-disabled', 'true');
  });
});
