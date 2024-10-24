import React, { Suspense } from 'react';
import DashboardWrapper from '@/app/components/dashboard/DashboardWrapper';
import { DashboardErrorBoundary } from '@/app/DashboardErrorBoundary';
import { UserProvider } from '@/app/contexts/UserContext';
import Loading from './loading';

export default function DashboardLayout({ children }) {
  return (
    <DashboardErrorBoundary>
      <UserProvider>
        <Suspense fallback={<Loading />}>
          <DashboardWrapper>
            {children}
          </DashboardWrapper>
        </Suspense>
      </UserProvider>
    </DashboardErrorBoundary>
  );
}