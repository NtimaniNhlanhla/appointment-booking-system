import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found';
      message = "The page you're looking for doesn't exist.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <PageContainer>
      <div className="text-center py-16">
        <p className="text-5xl font-bold text-danger mb-4" aria-hidden="true">!</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex flex-col gap-3 items-center">
          <Button onClick={() => navigate('/')}>Go Home</Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}