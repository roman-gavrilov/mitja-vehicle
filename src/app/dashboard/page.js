import { createClient } from "@/prismicio";
import Sidebar from "../components/dashboard/sidebar";
import DashboardSections from "@/app/components/dashboard/overview/dashboardSections";
import MyVehiclesSection from "@/app/components/dashboard/overview/myVehiclesSection";
// import MoreServicesSection from "@/app/components/dashboard/overview/MoreServicesSection";
 
const DashboardPage = async () => {
  const client = createClient();

  return (
    <>
      <DashboardSections />
      <MyVehiclesSection />
      {/* <MoreServicesSection /> */}
    </>
   );
 };
 
 export default DashboardPage;