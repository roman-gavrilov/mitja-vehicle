"use client";
import React, { useState, useEffect } from "react";
import { PlusCircleIcon, TruckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const calculateTimeAgo = (createdDate) => {
  const now = new Date();
  const createdAt = new Date(createdDate);
  const diffInMs = now - createdAt;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `about ${diffInDays} day(s) ago`;
  } else if (diffInHours > 0) {
    return `about ${diffInHours} hour(s) ago`;
  } else {
    return `about ${diffInMinutes} minute(s) ago`;
  }
};

const CarCard = ({ car }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 flex items-center mb-4 relative">
      <a
        className="absolute top-2.5 right-2.5 text-sm"
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_SHOPIFY_STORE}products/${car.shopifyproduct.handle}`}
      >
        View vehile
      </a>
      {/* Placeholder image on the left side */}
      <div className="w-16 h-16 mr-4 flex justify-center items-center bg-gray-200 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width={40} height={30}>
            <title>{"illu-car-basics"}</title>
            <path
              fill="none"
              fillRule="evenodd"
              d="M282.44 325.4a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m-24.95-9.851c1.293-5.055 2.763-6.948 3.449-7.75 1.072-1.25 3.572-2.5 10-2.5 6.43 0 8.93 1.25 10 2.5.687.802 2.157 2.695 3.45 7.75-2.751 1.054-7.003 1.85-13.45 1.85-6.446 0-10.698-.796-13.45-1.85m1.95 9.85a2.5 2.5 0 1 1 0-4.998 2.5 2.5 0 0 1 0 4.999m27.815-11h-.571c-.12-.505-.243-.986-.36-1.438-.195-.747-1.944-4.796-3.421-6.543-1.973-2.332-5.754-3.42-11.9-3.42-6.145 0-9.926 1.088-11.9 3.419-1.476 1.747-3.225 5.797-3.42 6.543-.12.453-.24.934-.361 1.439h-.57c-3.152 0-3.771 1.78-3.75 3.239.008.579.522 1.112 1.096 1.185l2.252.285c-.49 2.852-.26 5.94-.36 9.225v3.579c0 .82.667 1.487 1.488 1.487h2.032c.818 0 1.48-.67 1.48-1.487V329.4h24V331.913c0 .82.667 1.487 1.488 1.487h2.032c.818 0 1.48-.67 1.48-1.487V328.334c-.1-3.234.154-6.373-.335-9.224l2.254-.286c.575-.072 1.088-.605 1.096-1.185.02-1.46-.6-3.24-3.75-3.24"
              style={{
                fill: "#b5b9bf",
                marginTop: 4,
              }}
              transform="translate(-251 -303)"
            />
          </svg>
        </div>

      {/* Car details on the right side */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          Created: {calculateTimeAgo(car.createdAt)}
        </p>
        <h3 className="text-lg font-bold mb-1 capitalize">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-600">
          {car.power} / {car.powerUnit} • 1st Reg. {car.month}/{car.year} •{" "}
          {car.mileage} km
        </p>
      </div>
    </div>
  );
};

export default function SellVehicle() {
  const [salelists, setSalelists] = useState([]);

  useEffect(() => {
    const fetchSalelists = async () => {
      try {
        const response = await fetch("/api/dashboard/savelists");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSalelists(data.salelists);
          }
        } else {
          console.error("Failed to fetch salelists");
        }
      } catch (error) {
        console.error("Error fetching salelists:", error);
      }
    };

    fetchSalelists();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-10 bg-white shadow rounded-lg">
      <style jsx>{`
        .initialBox {
          cursor: pointer;
          transition:
            border-color 300ms,
            background-color 300ms;
        }
        .initialBox:hover {
          border-color: #2176ff !important;
          background-color: #e4ecf9;
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-6">Rent My vehicles</h1>

      {salelists.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {salelists.map((salelist, index) => (
              <CarCard key={index} car={salelist} />
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Create new one</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[200px] initialBox">
        <PlusCircleIcon
          color="#2176ff"
          className="w-16 h-16 text-gray-400 mb-4"
        />
        <p className="text-lg mb-2">
          Do you have any treasures in your garage?
        </p>
        <Link href="/dashboard/direct-sale/sell-your-car">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Rent your car for free
          </button>
        </Link>
      </div>
    </div>
  );
}
