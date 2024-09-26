"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/dashboard/sidebar";
import DeleteVehicleModal from "@/app/components/dashboard/myvehicle/DeleteVehicleModal";

async function getVehicleData(id) {
  const res = await fetch(`http://localhost:3000/api/dashboard/vehicle/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch vehicle data");
  }
  return res.json();
}

async function deleteVehicle(id) {
  const res = await fetch(`http://localhost:3000/api/dashboard/vehicle/${id}`, {
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <div className="container max-w-[800px] mx-auto">
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
                <p className="text-xl font-semibold">{vehicle.name}</p>
                <p className="text-sm text-gray-500">
                  {" "}
                  Purchased {vehicle.purchaseDate}
                </p>
                <div className="flex items-center justify-center mt-4 h-[180px] bg-gray-200 rounded-lg">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 6H8v2H5v2h2v2H5v2h2v2H5v2h2v2h14V6H16zM7 10h2V8H7v2zm0 4h2v-2H7v2zm0 4h2v-2H7v2zm4 0h2v-2h-2v2zm4-6v2h-2v-2h2zm0 4v2h-2v-2h2zm0-6v2h-2V8h2zm-4 2v2h-2v-2h2zm0-2v2h-2V8h2zm0 6v2h-2v-2h2zm-2-10V6h2v2h-2zm10-2v14H8v2h8v-2h4v2h2V8h2V6h-2V4h-2zm-4 2h-2V4h2v2zm4 0h-2V4h2v2zm0 2h-2v10h2V8z" />
                  </svg>
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
                <p className="text-lg font-bold">{vehicle.annualMileage} km</p>
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
                <p className="text-lg font-bold">{vehicle.totalMileage} km</p>
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
              <div className="border p-4 rounded-lg">
                <p className="text-lg font-bold">{vehicle.nextService}</p>
                <p className="text-sm text-gray-500">Next service</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    d="M21.368 36.1884L33.442 24.1144L30.9672 21.6395L21.368 31.2387L17.6743 27.545L15.1994 30.0198L21.368 36.1884Z"
                    fill="#1A617A"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M38 8H30.7101C29.8496 5.10851 27.171 3 24 3C20.829 3 18.1504 5.10851 17.2899 8H10C7.79086 8 6 9.79086 6 12V41C6 43.2091 7.79086 45 10 45H38C40.2091 45 42 43.2091 42 41V12C42 9.79086 40.2091 8 38 8ZM33 16V12H38V41H10V12H15V16C15 16.5523 15.4477 17 16 17H32C32.5523 17 33 16.5523 33 16ZM24 7C24.8885 7 25.6868 7.38625 26.2361 8C26.7111 8.53076 27 9.23165 27 10C27 10.7249 26.7429 11.3897 26.3149 11.9083C26.2893 11.9394 26.263 11.97 26.2361 12C25.6868 12.6137 24.8885 13 24 13C23.1115 13 22.3132 12.6138 21.7639 12C21.2889 11.4692 21 10.7684 21 10C21 9.27513 21.2571 8.6103 21.6851 8.09172C21.7107 8.06062 21.737 8.03004 21.7639 8C22.3132 7.38625 23.1115 7 24 7Z"
                    fill="#1A617A"
                  />
                </svg>
              </div>
              <div className="border p-4 rounded-lg">
                <a
                  href="#"
                  className="text-lg font-bold text-teal-600 underline"
                >
                  Compare
                </a>
                <p className="text-sm text-gray-500">Market value</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    d="M28.767 28.1899L30 31.0759C29.977 31.0965 29.947 31.1264 29.9092 31.164C29.4815 31.5895 28.0638 33 24.7596 33C21.189 33 18.5431 31.0253 17.644 26.9494H16V24.5949H17.3101C17.3101 24.5949 17.2844 24.2152 17.2844 23.8608V23.1772H16V20.8481H17.6954C18.4661 17.2532 21.1119 15 24.8624 15C27.1486 15 28.8697 15.7848 29.4606 16.1646L28.5101 19.3797C28.0477 18.9494 26.9174 18.1139 25.1193 18.1139C23.3211 18.1139 22.2165 19.0253 21.8826 20.8481H26.8147V23.1772H21.4202C21.4202 23.1772 21.3945 23.557 21.3945 23.8608C21.3945 24.1646 21.4202 24.5949 21.4202 24.5949H26.8147V26.9494H21.8826C22.1138 28.6456 23.2954 29.7089 25.0936 29.7089C26.8917 29.7089 28.0477 28.7975 28.767 28.1899Z"
                    fill="#1A617A"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M45 24C45 35.598 35.598 45 24 45C12.402 45 3 35.598 3 24C3 12.402 12.402 3 24 3C35.598 3 45 12.402 45 24ZM41 24C41 33.3888 33.3888 41 24 41C14.6112 41 7 33.3888 7 24C7 14.6112 14.6112 7 24 7C33.3888 7 41 14.6112 41 24Z"
                    fill="#1A617A"
                  />
                </svg>
              </div>
              <div className="col-span-2 border p-4 rounded-lg flex items-center">
                <div className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-full">
                  100%
                </div>
                <div className="ml-4">
                  <p className="text-lg font-bold">Your vehicle profile</p>
                  <p className="text-sm text-gray-500">
                    Congratulations! All your data is up to date and complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow mb-6">
            <h2 className="text-xl font-bold mb-4">My vehicle evaluation</h2>
            <p className="mb-4">Vehicle evaluation not possible</p>
            <p className="text-sm text-gray-600 mb-4">
              Unfortunately, we were unable to carry out a reliable car
              valuation. Alternatively, comparable offers on our marketplace can
              give you a first overview.
            </p>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md">
              Compare prices
            </button>
          </div>
        </div>
      </div>

      <DeleteVehicleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
