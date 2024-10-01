import React from 'react';
import Select from "react-select";
import {
  carMakes,
  carModels,
  getYearOptions,
  monthOptions,
} from "../../../components/ads/carData";
import { GreenCheckMark, DoorSelector, ButtonGroup, CountrySelect, renderSelectWithCheckMark, CustomSelectStyles } from "./CustomComponents";

export function VehicleDetails({ carState, handleInputChange, showMoreDetails }) {
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

  return (
    <div className="mr-[40px]">
      <div className="mb-4">
        <label className="block text-sm mb-2 font-semibold">More brands *</label>
        {renderSelectWithCheckMark(
          brandOptions,
          brandOptions.find((option) => option.value === carState.brand),
          (selectedOption) => handleInputChange("brand", selectedOption.value),
          "Choose brand"
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-2 font-semibold">Model *</label>
        {renderSelectWithCheckMark(
          modelOptions,
          modelOptions.find((option) => option.value === carState.model),
          (selectedOption) => handleInputChange("model", selectedOption.value),
          "Choose model",
          !carState.brand
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-2 font-semibold">First registration *</label>
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
        <label className="block text-sm mb-2 font-semibold">Mileage *</label>
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
            <DoorSelector doors={carState.doors} handleInputChange={handleInputChange} />
          </div>
          {carState.doors && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Fuel Type *</label>
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
              <label className="block text-sm mb-2 font-semibold">Power *</label>
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
    </div>
  );
}

export function FurtherInformation({ carState, handleInputChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Further Information</label>
      <hr className="border-t border-gray-300 mb-4" />
      
      <div className="mb-4">
        <ButtonGroup
          options={[
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
          ]}
          value={carState.isRoadworthy}
          onChange={handleInputChange}
          name="isRoadworthy"
          label="Is your car roadworthy and registered?"
        />
      </div>

      <div className="mb-4">
        <ButtonGroup
          options={[
            { value: 'private', label: 'Private' },
            { value: 'commercial', label: 'Commercial (VAT can be shown)' },
          ]}
          value={carState.saleType}
          onChange={handleInputChange}
          name="saleType"
          label="Type of sale?"
        />
      </div>

      <div className="mb-4">
        <ButtonGroup
          options={[
            { value: 'within_months', label: 'Within nearest months' },
            { value: 'dont_know', label: "Don't know yet" },
            { value: 'asap', label: 'As soon as possible' },
          ]}
          value={carState.sellPlan}
          onChange={handleInputChange}
          name="sellPlan"
          label="When do you plan to sell?"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Where would you like to sell your car? *</label>
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
        <label className="block mb-2 text-sm font-semibold">Logged in as (change) *</label>
        <input
          type="text"
          className="border rounded-md p-2 w-full"
          placeholder="Username"
          value={carState.loggedInAs}
          onChange={(e) => handleInputChange("loggedInAs", e.target.value)}
          readOnly
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
  );
}