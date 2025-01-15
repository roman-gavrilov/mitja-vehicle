"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DashboardSections = () => {
  const router = useRouter();

  const handleNavigation = (href) => {
    if (href) {
      router.push(href);
    }
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
    <div className="flex flex-col items-center mb-4 md:mb-[20px] pb-4 md:pb-[20px] pt-4 md:pt-[20px] px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Hello, what do you want to do today?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col cursor-pointer items-center text-center transition-transform hover:scale-105"
            onClick={() => handleNavigation(item.link)}
          >
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">
              <Image width={40} height={40} src={item.icon?.url} alt={item.box_title} />
            </div>
            <h2 className="text-lg md:text-xl font-bold">{item.box_title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSections;
