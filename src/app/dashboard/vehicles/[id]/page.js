"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/app/components/dashboard/sidebar";
import DeleteVehicleModal from "@/app/components/dashboard/myvehicle/DeleteVehicleModal";

async function getVehicleData(id) {
  const res = await fetch(`/api/dashboard/vehicle/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch vehicle data");
  }
  return res.json();
}

async function deleteVehicle(id) {
  const res = await fetch(`/api/dashboard/vehicle/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete vehicle");
  }
  return res.json();
}

export default function VehiclePage({ params }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null);

  useState(() => {
    getVehicleData(params.id).then(setVehicle);
  }, [params.id]);

  const handleDelete = async () => {
    try {
      await deleteVehicle(params.id);
      setShowModal(false);
      router.push("/dashboard/vehicles");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  if (!vehicle) return null;

  return (
    <>
          <div className="flex justify-between items-center mb-6">
            <Link
              href="/dashboard/vehicles"
              className="inline-block px-4 py-2 bg-gray-200 rounded-md"
            >
              Back
            </Link>
            <div className="space-x-4">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md">
                + Add vehicle
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-md"
                onClick={() => setShowModal(true)}
              >
                Delete
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">
            All details about your {vehicle.make}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-md shadow mb-6">
            {/* Vehicle Image and Info */}
            <div className="col-span-1 border p-4 rounded-lg flex flex-col justify-between h-full">
              <div>
                <p className="text-xl font-semibold">{vehicle.model}</p>
                <p className="text-sm text-gray-500">
                  {" "}
                  Purchased {vehicle.purchaseYear} {vehicle.purchaseMonth}
                </p>
                <div className="flex items-center justify-center mt-4 h-[180px] bg-gray-200 rounded-lg">
                  {vehicle.image ? (
                    <Image
                      alt="Vehicle Image"
                      src={vehicle.image}
                      width={500}
                      height={300}
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 6H8v2H5v2h2v2H5v2h2v2H5v2h2v2H5v2h14V6H16zM7 10h2V8H7v2zm0 4h2v-2H7v2zm0 4h2v-2H7v2zm4 0h2v-2h-2v2zm4-6v2h-2v-2h2zm0 4v2h-2v-2h2zm0-6v2h-2V8h2zm-4 2v2h-2v-2h2zm0-2v2h-2V8h2zm0 6v2h-2v-2h2zm-2-10V6h2v2h-2zm10-2v14H8v2h8v-2h4v2h2V8h2V6h-2V4h-2zm-4 2h-2V4h2v2zm4 0h-2V4h2v2zm0 2h-2v10h2V8z" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg">
                  Show vehicle data
                </button>
                <button className="mt-2 w-full bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg">
                  Compare prices
                </button>
              </div>
            </div>

            {/* Mileage Info */}
            <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-6">
              <div className="border p-4 rounded-lg">
                <p className="text-lg font-bold">{vehicle.kilometersPerYear} km</p>
                <p className="text-sm text-gray-500">Annual mileage</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    d="M5.40479 40C3.24849 36.5981 2 32.3258 2 28C2 15.8497 11.8497 6 24 6C36.1503 6 46 15.8497 46 28C46 32.3258 44.7515 36.5981 42.5952 40H40.74L35.8751 37.1654L37.8779 33.703L40.4959 35.2145C41.4632 33.0058 42 30.5656 42 28C42 27.8298 41.9976 27.66 41.9929 27.4909L38.9998 27.9116L38.4469 23.95L41.4404 23.5293C40.7997 21.0223 39.6326 18.7259 38.0639 16.7648L35.9268 18.9019L33.0984 16.0734L35.2355 13.9363C32.646 11.8648 29.4718 10.4937 26 10.1099V13.1322H22V10.1099C18.5283 10.4936 15.3541 11.8648 12.7646 13.9362L14.9017 16.0734L12.0733 18.9018L9.93617 16.7647C8.36743 18.7258 7.20035 21.0222 6.5596 23.5292L9.55321 23.9499L9.0003 27.9115L6.00706 27.4908C6.00236 27.66 6 27.8297 6 28C6 30.5656 6.53678 33.0059 7.50415 35.2146L10.1222 33.7031L12.1251 37.1655L7.26 40H5.40479Z"
                    fill="#1A617A"
                  />
                  <path
                    d="M16.5543 19.6134L17.0555 24.0573L25.7697 37.476L29.1244 35.2975L20.4102 21.8788L16.5543 19.6134Z"
                    fill="#1A617A"
                  />
                </svg>
              </div>
              <div className="border p-4 rounded-lg">
                <p className="text-lg font-bold">{vehicle.currentMileage} km</p>
                <p className="text-sm text-gray-500">Mileage</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path d="M10 6H14L8 42H4L10 6Z" fill="#1A617A" />
                  <path d="M34 6H38L44 42H40L34 6Z" fill="#1A617A" />
                  <path d="M26 6H22V11H26V6Z" fill="#1A617A" />
                  <path d="M22 18H26V26H22V18Z" fill="#1A617A" />
                  <path d="M26 33H22V42H26V33Z" fill="#1A617A" />
                </svg>
              </div>
            </div>
          </div>

      <DeleteVehicleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
