import React, { Suspense } from 'react';
import DashboardWrapper from '@/app/components/dashboard/DashboardWrapper';
import { DashboardErrorBoundary } from '@/app/DashboardErrorBoundary';
import Loading from './loading';

export default function DashboardLayout({ children }) {
  return (
    <DashboardErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DashboardWrapper>
          {children}
        </DashboardWrapper>
      </Suspense>
    </DashboardErrorBoundary>
  );
}