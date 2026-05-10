import { useNavigate } from 'react-router-dom';
import type { Branch } from '@/features/bookings/types/booking.types';

interface BranchListItemProps {
  branch: Branch;
}

export function BranchListItem({ branch }: BranchListItemProps) {
  const navigate = useNavigate();
  const placeholder = `https://placehold.co/56x56/2563EB/FFFFFF?text=${branch.name[0]}`;

  return (
    <article
      className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/book/${branch.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/book/${branch.id}`)}
      aria-label={`Select ${branch.name}`}
    >
      <img
        src={branch.imageUrl ?? placeholder}
        alt={branch.name}
        className="w-14 h-14 rounded object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{branch.name}</p>
        <p className="text-xs text-gray-500">{branch.city}</p>
        <p className="text-xs text-gray-500">{branch.openingTime} – {branch.closingTime}</p>
      </div>
      {/* Chevron icon */}
      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </article>
  );
}