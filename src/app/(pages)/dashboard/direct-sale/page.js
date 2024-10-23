"use client";
import React, { useState, useEffect } from "react";
import { PlusCircleIcon, TruckIcon } from "@heroicons/react/24/outline";
import CarCard from "@/app/components/dashboard/CarCard";
import Link from "next/link";

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

      <h1 className="text-3xl font-bold mb-6">Sell My vehicles</h1>

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
      <Link href="/dashboard/direct-sale/save">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[200px] initialBox">
          <PlusCircleIcon
            color="#2176ff"
            className="w-16 h-16 text-gray-400 mb-4"
          />
          <p className="text-lg mb-2">
            Do you have any treasures in your garage?
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Whether you want to run a Direct Sale for the quickest sale or an ad
            for the best price, we offer you the right option for selling your
            vehicle!
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Sell your vehicle for free
          </button>
        </div>
      </Link>
    </div>
  );
}
