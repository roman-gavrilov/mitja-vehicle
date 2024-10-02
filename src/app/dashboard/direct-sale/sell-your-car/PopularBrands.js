import React from 'react';
import { popularBrands } from "../../../components/ads/carData";

export default function PopularBrands({ handleBrandClick, selectedBrand }) {
  return (
    <>
      <h2 className="font-semibold text-sm mb-4">Popular brands</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {popularBrands.map((popularBrand) => (
          <button
            key={popularBrand.name}
            className={`border rounded-md p-4 flex items-center justify-center cursor-pointer bg-white transition-colors duration-300 ${
              selectedBrand === popularBrand.name.toLowerCase()
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => handleBrandClick(popularBrand.name)}
          >
            <img
              src={popularBrand.icon}
              alt={popularBrand.name}
              className="max-w-[40px] max-h-[40px]"
            />
          </button>
        ))}
      </div>
    </>
  );
}