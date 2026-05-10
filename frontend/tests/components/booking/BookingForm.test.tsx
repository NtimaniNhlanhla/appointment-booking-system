import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '@/components/booking/BookingForm';

const validValues = {
  customerName: 'Thabo Nkosi',
  customerEmail: 'thabo@email.com',
  customerPhone: '0821234567',
};

describe('BookingForm', () => {
  it('renders name, email, phone and notes fields', () => {
    render(<BookingForm onSubmit={vi.fn()} isSubmitting={false} />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('shows validation error for empty name on submit', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={vi.fn()} isSubmitting={false} />);
    await user.click(screen.getByRole('button', { name: /confirm booking/i }));
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email on submit', async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={vi.fn()} isSubmitting={false} />);
    await user.type(screen.getByLabelText(/full name/i), 'Thabo Nkosi');
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.type(screen.getByLabelText(/phone number/i), '0821234567');
    await user.click(screen.getByRole('button', { name: /confirm booking/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correct values when form is valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BookingForm onSubmit={onSubmit} isSubmitting={false} />);
    await user.type(screen.getByLabelText(/full name/i), validValues.customerName);
    await user.type(screen.getByLabelText(/email address/i), validValues.customerEmail);
    await user.type(screen.getByLabelText(/phone number/i), validValues.customerPhone);
    await user.click(screen.getByRole('button', { name: /confirm booking/i }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const [calledWith] = onSubmit.mock.calls[0] as [Record<string, unknown>];
    expect(calledWith.customerName).toBe(validValues.customerName);
    expect(calledWith.customerEmail).toBe(validValues.customerEmail);
    expect(calledWith.customerPhone).toBe(validValues.customerPhone);
  });

  it('shows spinner on SubmitButton when isSubmitting=true', () => {
    render(<BookingForm onSubmit={vi.fn()} isSubmitting={true} />);
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /processing/i })).toBeDisabled();
  });
});
