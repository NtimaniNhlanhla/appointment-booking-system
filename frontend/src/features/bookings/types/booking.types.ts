export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  province: string;
  openingTime: string;
  closingTime: string;
  imageUrl?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  status: 'CONFIRMED' | 'CANCELLED';
  notes?: string;
  slot: {
    startTime: string;
    endTime: string;
    slotDate: string;
  };
  branch: {
    name: string;
    address: string;
    city: string;
    province: string;
  };
  createdAt: string;
}

export interface CreateBookingPayload {
  slotId: string;
  branchId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}