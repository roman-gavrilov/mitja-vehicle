import { createClient } from "@/prismicio";
import { HomeIcon } from "@heroicons/react/24/outline";

const DashboardCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="text-5xl mb-4"><img width={40} height={40} src={icon} alt={title} /></div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const DashboardSections = async () => {
  const data = [
    {
      box_title: "Start a new search",
      box_content: "0 vehicles",
      icon: {
        url: "/images/svgviewer-png-output (2).png"
      }
    },
    {
      box_title: "View my searches",
      box_content: "No saved searches",
      icon: {
        url: "/images/svgviewer-png-output (1).png"
      }
    },
    {
      box_title: "Go to my listings",
      box_content: "0 vehicles",
      icon: {
        url: "/images/svgviewer-png-output (3).png"
      }
    }
  ]

  return (
    <div className="bg-gray-100 flex flex-col items-center mb-[20px] pb-[20px] border pt-[20px]">
      <h1 className="text-3xl font-bold mb-6">
        Hello, what do you want to do today?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
          data.map((item, index) => (
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
