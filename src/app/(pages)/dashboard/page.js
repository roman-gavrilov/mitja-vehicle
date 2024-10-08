import { createClient } from "@/prismicio";
import DashboardSections from "@/app/components/dashboard/overview/dashboardSections";
 
const DashboardPage = async () => {
  const client = createClient();

  return (
    <DashboardSections />
   );
 };
 
 export default DashboardPage;