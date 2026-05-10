import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { HomePage } from '@/pages/HomePage';
// import { BookingPage } from '@/pages/BookingPage';
// import { ConfirmationPage } from '@/pages/ConfirmationPage';
// import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/book/:branchId" element={<BookingPage />} />
        <Route path="/confirmation/:bookingReference" element={<ConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
}