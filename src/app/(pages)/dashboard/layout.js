import DashboardWrapper from '@/app/components/dashboard/DashboardWrapper';

export default function DashboardLayout({ children }) {
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}