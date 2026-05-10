interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, className = '', hover = false, padding = true }: CardProps) {
  return (
    <div className={`
      bg-white rounded-xl shadow-sm
      ${padding ? 'p-4' : ''}
      ${hover ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}