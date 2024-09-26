"use client";

import { PlusCircleIcon, TruckIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import AddVehicleModal from "../myvehicle/addmodal";
import Link from "next/link";

const MyVehiclesSection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/dashboard/vehicles");
        const data = await response.json();
        setVehicles(data.vehicles || []);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-[50px] max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My vehicles</h2>
      <p className="mb-4">
        Here you can find your current and previous vehicles.
      </p>

      {loading && <p>Loading your vehicles...</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {vehicles.length === 0 ? (
            <>
              <div className="border p-4 rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <PlusCircleIcon className="h-6 w-6 text-blue-700 mr-2" />
                  <p className="text-lg font-medium">
                    You have not added a vehicle yet
                  </p>
                </div>
                <button
                  className="bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
                  onClick={handleOpenModal}
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add vehicle
                </button>
              </div>

              {/* Digital twin of your vehicle section */}
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold mb-2">
                  The digital twin of your vehicle
                </h3>
                <ul className="list-none space-y-2">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                    <span>
                      Never forget an appointment again: We remind you of the
                      next inspection date or tire change.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                    <span>
                      All vehicle data at a glance: Here you will always find
                      all your important data!
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                    <span>
                      The current market value: Is it worth selling? Here you
                      get the market value in a flash!
                    </span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {vehicles.map((vehicle, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      100%
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-md p-4 mb-2">
                    <TruckIcon className="w-full h-40 text-gray-400" />
                  </div>
                  <Link href={`/dashboard/vehicles/${vehicle._id}`}>
                    <button className="mt-2 bg-gray-200 text-black py-2 px-4 rounded-lg w-full">
                      Details
                    </button>
                  </Link>
                </div>
              ))}

              <div className="border p-4 rounded-md flex flex-col items-center justify-center">
                <PlusCircleIcon className="h-12 w-12 text-blue-700 mb-2" />
                <p className="text-lg font-medium mb-2">Add another vehicle</p>
                <button
                  className="bg-blue-700 text-white py-2 px-4 rounded-lg"
                  onClick={handleOpenModal}
                >
                  Add vehicle
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <AddVehicleModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </div>
  );
};

export default MyVehiclesSection;
