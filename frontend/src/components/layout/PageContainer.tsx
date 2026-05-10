interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`max-w-md mx-auto px-4 py-6 ${className}`}>
      {children}
    </main>
  );
}