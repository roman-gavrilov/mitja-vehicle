import { createClient } from "@/prismicio";

import Sidebar from "@/app/components/dashboard/sidebar";
import MyVehiclesSection from "@/app/components/dashboard/overview/myVehiclesSection";

const MyVehiclePage = async () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="container max-w-[800px] mx-auto">
          <MyVehiclesSection />
        </div>
      </main>
    </div>
  );
};

export default MyVehiclePage;
