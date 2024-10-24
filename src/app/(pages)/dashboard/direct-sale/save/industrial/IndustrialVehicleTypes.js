'use client';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ForkliftIcon from './ForkliftIcon';

const industrialVehicleTypes = [
  {
    title: 'Trucks over 7.5t',
    icon: LocalShippingIcon,
    description: 'Heavy-duty trucks and commercial vehicles'
  },
  {
    title: 'Trailer',
    icon: FireTruckIcon,
    description: 'Various types of trailers for commercial use'
  },
  {
    title: 'Vans/trucks up to 7.5t',
    icon: LocalShippingIcon,
    description: 'Light and medium-duty commercial vehicles'
  },
  {
    title: 'Semi-Trailer Trucks',
    icon: LocalShippingIcon,
    description: 'Articulated trucks and semi-trailers'
  },
  {
    title: 'Semi-trailer',
    icon: FireTruckIcon,
    description: 'Standalone semi-trailers for various uses'
  },
  {
    title: 'Buses and Coaches',
    icon: DirectionsBusIcon,
    description: 'Passenger transport vehicles'
  },
  {
    title: 'Agricultural Vehicles',
    icon: AgricultureIcon,
    description: 'Farming and agricultural machinery'
  },
  {
    title: 'Construction machines',
    icon: PrecisionManufacturingIcon,
    description: 'Heavy construction equipment'
  },
  {
    title: 'Forklift trucks',
    icon: ForkliftIcon,
    description: 'Material handling vehicles'
  }
];

export default function IndustrialVehicleTypes({ onSelectType, onBack }) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4"
      >
        <ArrowBackIcon />
        <span>Back to Vehicle Types</span>
      </button>
      <h1 className="text-3xl font-semibold text-center mb-8">
        Choose Industrial Vehicle Type
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {industrialVehicleTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.title}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer p-6 border border-transparent hover:border-blue-500"
              onClick={() => onSelectType(type.title)}
            >
              <div className="flex flex-col items-center text-center">
                <Icon sx={{fontSize:60}} className="text-blue-600 mb-4 transform group-hover:scale-110 transition-transform duration-300 ease-in-out" />
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