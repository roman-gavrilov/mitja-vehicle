import { createClient } from "@/prismicio";
// import { useRouter } from 'next/navigation';

import Sidebar from "../components/dashboard/sidebar";
import DashboardSections from "@/app/components/dashboard/overview/dashboardSections";
import MyVehiclesSection from "@/app/components/dashboard/overview/myVehiclesSection";
import MoreServicesSection from "@/app/components/dashboard/overview/MoreServicesSection";

const DashboardPage = async () => {
  // const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    // router.push('/login');
  };

  const client = createClient();  

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar/>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="container max-w-[800px] mx-auto">
          <DashboardSections />
          <MyVehiclesSection />
          <MoreServicesSection />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
