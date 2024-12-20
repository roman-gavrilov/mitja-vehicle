"use client";
import { useState } from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import ElectricBikeIcon from "@mui/icons-material/ElectricBike";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CarForm from "@/app/(pages)/dashboard/direct-sale/save/car/CarForm";
import MotorcycleForm from "@/app/(pages)/dashboard/direct-sale/save/motorcycle/MotorcycleForm";
import EBikeForm from "@/app/(pages)/dashboard/direct-sale/save/ebike/EBikeForm";
import IndustrialForm from "@/app/(pages)/dashboard/direct-sale/save/industrial/IndustrialForm";
import MotorHomeForm from "@/app/(pages)/dashboard/direct-sale/save/motorhome/MotorHomeForm";
import IndustrialVehicleTypes from "@/app/(pages)/dashboard/direct-sale/save/industrial/IndustrialVehicleTypes";
import Alert from "@mui/material/Alert";
import { useUser } from "@/app/contexts/UserContext";

export default function SellYourVehicle() {
  const [selectedType, setSelectedType] = useState(null);
  const [industrialType, setIndustrialType] = useState(null);
  const { user } = useUser();

  const isDisabled = user?.role === "private" && user?.vehicles?.length === 1;

  const vehicleTypes = [
    {
      title: "Car",
      icon: DirectionsCarIcon,
      description: "Sell your car quickly and easily",
    },
    {
      title: "Motorcycle",
      icon: TwoWheelerIcon,
      description: "List your motorcycle for sale",
    },
    {
      title: "E-Bike",
      icon: ElectricBikeIcon,
      description: "Sell your electric bicycle",
    },
    {
      title: "Industrial Vehicle",
      icon: LocalShippingIcon,
      description: "Market your commercial vehicle",
    },
    {
      title: "Motor Home",
      icon: HolidayVillageIcon,
      description: "Find a buyer for your motor home",
    },
  ];

  const renderForm = () => {
    switch (selectedType) {
      case "Car":
        return <CarForm />;
      case "Motorcycle":
        return <MotorcycleForm />;
      case "E-Bike":
        return <EBikeForm />;
      case "Industrial Vehicle":
        if (!industrialType) {
          return (
            <IndustrialVehicleTypes
              onSelectType={(type) => setIndustrialType(type)}
              onBack={() => setSelectedType(null)}
            />
          );
        }
        return <IndustrialForm vehicleType={industrialType} />;
      case "Motor Home":
        return <MotorHomeForm />;
      default:
        return null;
    }
  };

  if (selectedType) {
    return (
      <div>
        {selectedType === "Industrial Vehicle" && industrialType ? (
          <div>
            <button
              onClick={() => setIndustrialType(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4"
            >
              <ArrowBackIcon />
              <span>Back to Industrial Vehicle Types</span>
            </button>
            {renderForm()}
          </div>
        ) : selectedType === "Industrial Vehicle" ? (
          renderForm()
        ) : (
          <div>
            <button
              onClick={() => setSelectedType(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4"
            >
              <ArrowBackIcon />
              <span>Back to Vehicle Types</span>
            </button>
            {renderForm()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {isDisabled && (
        <div className="w-full mb-7">
          <Alert severity="error">
            {"You can't add more vehicles on this account."}
          </Alert>
        </div>
      )}
      <h1 className="text-3xl font-semibold text-center mb-8">
        Choose Vehicle Type
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicleTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.title}
              className={`group bg-white rounded-xl shadow-sm transition-all duration-300 ease-in-out transform border border-transparent ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:-translate-y-2 hover:border-blue-500 cursor-pointer"
              } p-6`}
              onClick={() => !isDisabled && setSelectedType(type.title)}
            >
              <div className="flex flex-col items-center text-center">
                <Icon
                  sx={{ fontSize: 60 }}
                  className={`text-blue-600 mb-4 transition-transform duration-300 ease-in-out ${
                    !isDisabled && "transform group-hover:scale-110"
                  }`}
                />
                <h2
                  className={`text-xl font-medium text-gray-900 mb-2 transition-colors duration-300 ${
                    !isDisabled && "group-hover:text-blue-600"
                  }`}
                >
                  {type.title}
                </h2>
                <p
                  className={`text-gray-500 text-sm transition-colors duration-300 ${
                    !isDisabled && "group-hover:text-gray-700"
                  }`}
                >
                  {type.description}
                </p>
              </div>
              <div
                className={`absolute inset-0 rounded-xl bg-blue-50 opacity-0 ${
                  !isDisabled && "group-hover:opacity-10"
                } transition-opacity duration-300 ease-in-out`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
