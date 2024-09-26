import { createClient } from "@/prismicio";
import { HomeIcon } from "@heroicons/react/24/outline";

const DashboardCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="text-5xl mb-4"><img src={icon} alt={title} /></div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const DashboardSections = async () => {
  const client = createClient();
  const { data } = await client.getSingle("admin_bashboard");

  return (
    <div className="bg-gray-100 flex flex-col items-center mb-[20px] pb-[20px] border pt-[20px]">
      <h1 className="text-3xl font-bold mb-6">
        {data?.dashboard_title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
          data.overview_boxes.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.box_title}
              description={item.box_content}
              icon={item.icon?.url}
            />
          ))
        }
      </div>
    </div>
  );
};

export default DashboardSections;
