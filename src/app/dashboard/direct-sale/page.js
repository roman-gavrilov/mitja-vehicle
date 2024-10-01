'use client';
import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
    <div className="border rounded-lg shadow-sm p-4 flex items-center mb-4">
      {/* Placeholder image on the left side */}
      <div className="w-16 h-16 mr-4 flex justify-center items-center bg-gray-200 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M7.5 12l4.5 4.5 4.5-4.5M12 15V3"
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
          {car.power} / {car.powerUnit} • 1st Reg. {car.month}/{car.year} •{' '}
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
        const response = await fetch('/api/mongodb/savelists');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSalelists(data.salelists);
          }
        } else {
          console.error('Failed to fetch salelists');
        }
      } catch (error) {
        console.error('Error fetching salelists:', error);
      }
    };

    fetchSalelists();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-10 bg-white shadow rounded-lg">
      <style jsx>{`
        .initialBox {
          cursor: pointer;
          transition: border-color 300ms, background-color 300ms;
        }
        .initialBox:hover {
          border-color: #2176ff !important;
          background-color: #e4ecf9;
        }
      `}</style>
      
      <h1 className="text-3xl font-bold mb-6">Sell My vehicles</h1>
      
      {salelists.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {salelists.map((salelist, index) => (
              <CarCard key={index} car={salelist}/>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Create new one</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[200px] initialBox">
        <PlusCircleIcon color="#2176ff" className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg mb-2">Do you have any treasures in your garage?</p>
        <p className="text-sm text-gray-600 mb-4">
          Whether you want to run a Direct Sale for the quickest sale or an ad for the best price, we offer you the right option for selling your vehicle!
        </p>
        <Link href="/dashboard/direct-sale/sell-your-car">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Sell your car for free
          </button>
        </Link>
      </div>
    </div>
  );
}