'use client';
import { useState } from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import CarForm from './CarForm';

export default function SellYourVehicle() {
  const [selectedType, setSelectedType] = useState(null);

  const vehicleTypes = [
    {
      title: 'Car',
      icon: DirectionsCarIcon,
      description: 'Sell your car quickly and easily'
    },
    {
      title: 'Motorcycle',
      icon: TwoWheelerIcon,
      description: 'List your motorcycle for sale'
    },
    {
      title: 'E-Bike',
      icon: ElectricBikeIcon,
      description: 'Sell your electric bicycle'
    },
    {
      title: 'Industrial Vehicle',
      icon: LocalShippingIcon,
      description: 'Market your commercial vehicle'
    },
    {
      title: 'Motor Home',
      icon: HolidayVillageIcon,
      description: 'Find a buyer for your motor home'
    }
  ];

  if (selectedType) {
    return <CarForm />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Choose Vehicle Type
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicleTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.title}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer p-6 border border-transparent hover:border-blue-500"
              onClick={() => setSelectedType(type.title)}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="text-blue-600 w-16 h-16 mb-4 transform group-hover:scale-110 transition-transform duration-300 ease-in-out" />
                <h2 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {type.title}
                </h2>
                <p className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors duration-300">
                  {type.description}
                </p>
              </div>
              <div className="absolute inset-0 rounded-xl bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-in-out" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
