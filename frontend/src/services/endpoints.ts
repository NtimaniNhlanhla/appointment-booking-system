export const ENDPOINTS = {
  BRANCHES: '/branches',
  BRANCH: (id: string) => `/branches/${id}`,
  SLOTS: '/slots',
  BOOKINGS: '/bookings',
  BOOKING: (ref: string) => `/bookings/${ref}`,
} as const;