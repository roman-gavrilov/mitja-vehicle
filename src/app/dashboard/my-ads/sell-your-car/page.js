"use client";
import React, { useState } from "react";
import Select from "react-select";
import {
  popularBrands,
  carMakes,
  carModels,
  getYearOptions,
  monthOptions,
} from "../../../components/ads/carData";

export default function SellYourCar() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [mileage, setMileage] = useState("");

  const handleBrandClick = (brandName) => {
    const selectedBrand = carMakes.find(
      (make) => make.name.toLowerCase() === brandName.toLowerCase()
    );
    if (selectedBrand) {
      setBrand(selectedBrand.value);
    } else {
      setBrand(brandName.toLowerCase());
    }
    setModel(""); // Reset the model when brand changes
  };

  const brandOptions = carMakes.map((make) => ({
    value: make.value,
    label: make.name,
  }));

  const modelOptions = brand
    ? carModels[brand.toLowerCase()]?.map((model) => ({
        value: model,
        label: model,
      }))
    : [];

  const yearOptions = getYearOptions();

  return (
    <div className="max-w-4xl mx-auto mt-8 p-10 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6">By listing or Direct-Sale</h1>
      <p className="mb-6">
        Offer your car to over 14 million potential buyers. Take control of the
        sale yourself and use your negotiating skills to achieve the best
        possible sale price!
      </p>
      <div className="w-3/4">
        <h2 className="font-semibold mb-4">Popular brands</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {popularBrands.map((popularBrand) => (
            <button
              key={popularBrand.name}
              className={`border rounded-md p-4 flex items-center justify-center cursor-pointer bg-white transition-colors duration-300 ${
                brand === popularBrand.name.toLowerCase()
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
        <div className="mr-[40px]">
          <div className="mb-4">
            <label className="block mb-2 font-bold">More brands</label>
            <Select
              options={brandOptions}
              value={brandOptions.find((option) => option.value === brand)}
              onChange={(selectedOption) =>
                handleBrandClick(selectedOption.label)
              }
              placeholder="Choose brand"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold">Model</label>
            <Select
              options={modelOptions}
              value={modelOptions.find((option) => option.value === model)}
              onChange={(selectedOption) => setModel(selectedOption.value)}
              placeholder="Choose model"
              isDisabled={!brand} // Disable if no brand is selected
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold">First registration</label>
            <div className="mb-4">
              <div className="flex gap-4 justify-between">
                <div className="flex-1">
                  <Select
                    options={yearOptions}
                    value={yearOptions.find((option) => option.value === year)}
                    onChange={(selectedOption) => setYear(selectedOption.value)}
                    placeholder="Year"
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: "100%",
                      }),
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    options={monthOptions}
                    value={monthOptions.find(
                      (option) => option.value === month
                    )}
                    onChange={(selectedOption) =>
                      setMonth(selectedOption.value)
                    }
                    placeholder="Month"
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: "100%",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold">Mileage</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Mileage"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full transition-colors duration-300">
        Continue
      </button>
    </div>
  );
}
