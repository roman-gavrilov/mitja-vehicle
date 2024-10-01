"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  popularBrands,
  carMakes,
  carModels,
  getYearOptions,
  monthOptions,
} from "../../../components/ads/carData";

const GreenCheckMark = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

export default function SellYourCar() {
  const [carState, setCarState] = useState({
    brand: "",
    model: "",
    year: "",
    month: "",
    mileage: "",
    doors: "",
    fuelType: "",
    power: "",
    powerUnit: "kW",
    isRoadworthy: null,
    saleType: "",
    sellPlan: "",
    sellLocation: "",
    country: "Germany",
    loggedInAs: "",
  });

  const [showMoreDetails, setShowMoreDetails] = useState(false);

  useEffect(() => {
    const { brand, model, year, month, mileage } = carState;
    setShowMoreDetails(brand && model && year && month && mileage);
  }, [carState]);

  const handleBrandClick = (brandName) => {
    const selectedBrand = carMakes.find(
      (make) => make.name.toLowerCase() === brandName.toLowerCase()
    );
    setCarState(prevState => ({
      ...prevState,
      brand: selectedBrand ? selectedBrand.value : brandName.toLowerCase(),
      model: "",
      doors: "",
      fuelType: "",
      power: "",
      powerUnit: "kW",
    }));
  };

  const handleInputChange = (field, value) => {
    setCarState(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const brandOptions = carMakes.map((make) => ({
    value: make.value,
    label: make.name,
  }));

  const modelOptions = carState.brand
    ? carModels[carState.brand.toLowerCase()]?.map((model) => ({
        value: model,
        label: model,
      }))
    : [];

  const yearOptions = getYearOptions();

  const fuelTypeOptions = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
    { value: "lpg", label: "LPG" },
  ];

  const powerUnitOptions = [
    { value: 'kW', label: 'kW' },
    { value: 'hp', label: 'hp' },
  ];

  const CustomSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      paddingRight: '0',
    }),
    container: (provided) => ({
      ...provided,
      position: 'relative',
    }),
  };

  const renderSelectWithCheckMark = (options, value, onChange, placeholder, isDisabled = false) => (
    <div className="relative">
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        styles={CustomSelectStyles}
      />
      {value && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <GreenCheckMark />
        </div>
      )}
    </div>
  );

  const DoorSelector = () => {
    const options = ["2/3", "4/5", "6/7"];
  
    return (
      <div className="relative">
        <div className="flex border rounded-md overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleInputChange("doors", option)}
              className={`flex-1 p-2 text-center ${
                carState.doors === option ? 'bg-blue-100' : 'bg-white'
              } border-r last:border-r-0`}
            >
              {option}
            </button>
          ))}
        </div>
        {carState.doors && (
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
            <GreenCheckMark />
          </div>
        )}
      </div>
    );
  };

  const ButtonGroup = ({ options, value, onChange, name }) => (
    <div className="relative">
      <div className="flex border rounded-md overflow-hidden">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(name, option.value)}
            className={`flex-1 text-sm p-2 text-center ${
              value === option.value ? 'bg-blue-100' : 'bg-white'
            } border-r last:border-r-0`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {value !== null && value !== "" && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <GreenCheckMark />
        </div>
      )}
    </div>
  );

  const CountrySelect = ({ value, onChange }) => (
    <div className="relative">
      <Select
        options={[{ value: 'Germany', label: 'Germany' }]}
        value={{ value, label: value }}
        onChange={(selectedOption) => onChange("country", selectedOption.value)}
        styles={CustomSelectStyles}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {value && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <GreenCheckMark />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-10 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6">By listing or Direct-Sale</h1>
      <p className="mb-6">
        Offer your car to over 14 million potential buyers. Take control of the
        sale yourself and use your negotiating skills to achieve the best
        possible sale price!
      </p>
      <div className="w-3/4">
        <h2 className="font-semibold text-sm mb-4">Popular brands</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {popularBrands.map((popularBrand) => (
            <button
              key={popularBrand.name}
              className={`border rounded-md p-4 flex items-center justify-center cursor-pointer bg-white transition-colors duration-300 ${
                carState.brand === popularBrand.name.toLowerCase()
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
            <label className="block text-sm mb-2 font-bold">More brands</label>
            {renderSelectWithCheckMark(
              brandOptions,
              brandOptions.find((option) => option.value === carState.brand),
              (selectedOption) => handleBrandClick(selectedOption.label),
              "Choose brand"
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold">Model</label>
            {renderSelectWithCheckMark(
              modelOptions,
              modelOptions.find((option) => option.value === carState.model),
              (selectedOption) => handleInputChange("model", selectedOption.value),
              "Choose model",
              !carState.brand
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-bold">First registration</label>
            <div className="mb-4">
              <div className="flex gap-10 justify-between">
                <div className="flex-1">
                  {renderSelectWithCheckMark(
                    yearOptions,
                    yearOptions.find((option) => option.value === carState.year),
                    (selectedOption) => handleInputChange("year", selectedOption.value),
                    "Year"
                  )}
                </div>
                <div className="flex-1">
                  {renderSelectWithCheckMark(
                    monthOptions,
                    monthOptions.find((option) => option.value === carState.month),
                    (selectedOption) => handleInputChange("month", selectedOption.value),
                    "Month"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <label className="block text-sm mb-2 font-semibold">Mileage</label>
            <div className="flex items-center border rounded-md p-1 pr-[10px] bg-white relative">
              <input
                type="number"
                className="border-none flex-1 p-2 focus:outline-none"
                placeholder="Mileage"
                value={carState.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
              />
              <span className="text-gray-500 ml-2">km</span>
              {carState.mileage && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <GreenCheckMark />
                </div>
              )}
            </div>
          </div>

          {showMoreDetails && (
            <div className="mb-16">
              <label className="block mb-2 font-bold">More details</label>
              <hr className="border-t border-gray-300 mb-4" />
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Doors</label>
                <DoorSelector />
              </div>
              {carState.doors && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold">Fuel Type</label>
                  {renderSelectWithCheckMark(
                    fuelTypeOptions,
                    fuelTypeOptions.find((option) => option.value === carState.fuelType),
                    (selectedOption) => handleInputChange("fuelType", selectedOption.value),
                    "Choose fuel type"
                  )}
                </div>
              )}
              {carState.fuelType && (
                <div className="mb-4">
                  <label className="block text-sm mb-2 font-semibold">Power</label>
                  <div className="flex gap-10 items-center bg-white relative">
                    <input
                      type="number"
                      className="border rounded-md flex-1 p-2 focus:outline-none"
                      placeholder="Power"
                      value={carState.power}
                      onChange={(e) => handleInputChange("power", e.target.value)}
                    />
                    <Select
                      options={powerUnitOptions}
                      value={powerUnitOptions.find(option => option.value === carState.powerUnit)}
                      onChange={(selectedOption) => handleInputChange("powerUnit", selectedOption.value)}
                      isSearchable={false}
                      styles={{
                        ...CustomSelectStyles,
                        container: (provided) => ({
                          ...provided,
                          width: '140px',
                        }),
                        control: (provided) => ({
                          ...provided,
                          minHeight: '38px'
                        }),
                      }}
                    />
                    {carState.power && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                        <GreenCheckMark />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Further Information Section */}
          {carState.power && (
            <div className="mb-4">
              <label className="block mb-2 font-bold">Further Information</label>
              <hr className="border-t border-gray-300 mb-4" />
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Is your car roadworthy and registered?</label>
                <ButtonGroup
                  options={[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ]}
                  value={carState.isRoadworthy}
                  onChange={handleInputChange}
                  name="isRoadworthy"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Type of sale?</label>
                <ButtonGroup
                  options={[
                    { value: 'private', label: 'Private' },
                    { value: 'commercial', label: 'Commercial (VAT can be shown)' },
                  ]}
                  value={carState.saleType}
                  onChange={handleInputChange}
                  name="saleType"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">When do you plan to sell?</label>
                <ButtonGroup
                  options={[
                    { value: 'within_months', label: 'Within nearest months' },
                    { value: 'dont_know', label: "Don't know yet" },
                    { value: 'asap', label: 'As soon as possible' },
                  ]}
                  value={carState.sellPlan}
                  onChange={handleInputChange}
                  name="sellPlan"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Where would you like to sell your car?</label>
                <div className="flex gap-10 items-center relative">
                  <input
                    type="text"
                    className="border rounded-md p-2 focus:outline-none flex-1"
                    placeholder="Postal Code"
                    value={carState.sellLocation}
                    onChange={(e) => handleInputChange("sellLocation", e.target.value)}
                  />
                  <div className="w-32">
                    <CountrySelect
                      value={carState.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  {carState.sellLocation && (
                    <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                      <GreenCheckMark />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="block mb-2 text-sm font-semibold">Logged in as (change)</label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="Username"
                  value={carState.loggedInAs}
                  onChange={(e) => handleInputChange("loggedInAs", e.target.value)}
                />
                {carState.loggedInAs && (
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 mt-3">
                    <GreenCheckMark />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  We regularly send you emails with offers from mobile.de in connection with the sales process.
                  You can object to this use for marketing purposes at any time via the link in the e-mail or by
                  contacting customer service free of charge.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[100px]">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full transition-colors duration-300">
          Continue
        </button>
      </div>
    </div>
  );
}
