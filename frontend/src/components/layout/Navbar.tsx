import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left — back or placeholder */}
        <div className="w-16" />

        {/* Centre — brand */}
        <button
          onClick={() => navigate('/')}
          className="text-base font-semibold text-gray-900 hover:text-primary transition-colors"
        >
          Capitec Bookings
        </button>

        {/* Right — placeholder for symmetry */}
        <div className="w-16" />
      </div>
    </header>
  );
}