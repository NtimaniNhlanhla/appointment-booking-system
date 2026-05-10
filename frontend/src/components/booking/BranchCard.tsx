import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import type { Branch } from '@/features/bookings/types/booking.types';

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  const navigate = useNavigate();
  const placeholder = `https://placehold.co/400x240/2563EB/FFFFFF?text=${encodeURIComponent(branch.name)}`;

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Branch photo */}
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={branch.imageUrl ?? placeholder}
          alt={branch.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <h2 className="font-semibold text-gray-900 text-sm leading-tight">{branch.name}</h2>
        <p className="text-xs text-gray-500">{branch.city}</p>
        <p className="text-xs text-gray-500">{branch.openingTime} – {branch.closingTime}</p>
      </div>

      {/* CTA */}
      <div className="px-3 pb-3">
        <Button
          fullWidth
          variant="primary"
          size="sm"
          onClick={() => navigate(`/book/${branch.id}`)}
        >
          Select Branch
        </Button>
      </div>
    </article>
  );
}