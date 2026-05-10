import type { Branch } from '@/features/bookings/types/booking.types';

interface BranchHeaderProps {
  branch: Branch;
}

export function BranchHeader({ branch }: BranchHeaderProps) {
  const placeholder = `https://placehold.co/48x48/2563EB/FFFFFF?text=${branch.name[0]}`;

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm mb-2">
      <img
        src={branch.imageUrl ?? placeholder}
        alt={branch.name}
        className="w-12 h-12 rounded object-cover flex-shrink-0"
      />
      <div className="min-w-0">
        <h2 className="font-semibold text-gray-900 text-sm truncate">{branch.name}</h2>
        <p className="text-xs text-gray-500">{branch.address}</p>
        <p className="text-xs text-gray-500">{branch.openingTime} – {branch.closingTime}</p>
      </div>
    </div>
  );
}