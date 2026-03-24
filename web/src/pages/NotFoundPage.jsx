import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <EmptyState
          title="This page is off the map"
          description="The route you requested does not exist in the inventory app."
          action={
            <Link to="/">
              <Button variant="secondary">Return home</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
