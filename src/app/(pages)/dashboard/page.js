import { createClient } from "@/prismicio";
import DashboardSections from "@/app/components/dashboard/overview/dashboardSections";

const DashboardPage = async () => {
  const client = createClient();
  
  // Simulate a delay to make the loading state more noticeable
  await new Promise(resolve => setTimeout(resolve, 2000));

  // You might want to fetch some data here
  // const data = await client.getSomething();

  return (
    <DashboardSections />
  );
};

export default DashboardPage;