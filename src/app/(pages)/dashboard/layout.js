import DashboardWrapper from '@/app/components/dashboard/DashboardWrapper';
import { Suspense } from 'react';
import Loading from './loading';

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardWrapper>
        {children}
      </DashboardWrapper>
    </Suspense>
  );
}