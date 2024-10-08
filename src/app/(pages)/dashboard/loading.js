import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
  return (
    <div className="h-screen w-full"> {/* Tailwind class for full viewport height and width */}
      <Skeleton height="100%" width="100%" />
    </div>
  );
}
