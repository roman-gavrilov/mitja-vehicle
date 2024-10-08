"use client";

import { useRouter } from 'next/navigation';

const DashboardSections = () => {
  const router = useRouter();

  const handleNavigation = (href) => {
    router.push(href);
  };

  const data = [
    {
      box_title: "New search",
      icon: {
        url: "/images/svgviewer-png-output (2).png"
      }
    },
    {
      box_title: "Sell",
      icon: {
        url: "/images/svgviewer-png-output (1).png"
      },
      link: "/dashboard/direct-sale"
    },
    {
      box_title: "Parched vehicles",
      icon: {
        url: "/images/svgviewer-png-output (3).png"
      }
    },
    {
      box_title: "Ads statistics",
      icon: {
        url: "/images/svgviewer-png-output (3).png"
      }
    }
  ];

  return (
    <div className="bg-gray-100 flex flex-col items-center mb-[20px] pb-[20px] border pt-[20px]">
      <h1 className="text-3xl font-bold mb-6">
        Hello, what do you want to do today?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col cursor-pointer items-center text-center"
            onClick={() => handleNavigation(item.link)}
          >
            <div className="text-5xl mb-4">
              <img width={40} height={40} src={item.icon?.url} alt={item.box_title} />
            </div>
            <h2 className="text-xl font-bold">{item.box_title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSections;
