import React from "react";
import Select from "react-select";
import {
  carMakes,
  carModels,
  getYearOptions,
  monthOptions,
  bodyTypes,
} from "@/app/components/ads/carData";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import {
  GreenCheckMark,
  DoorSelector,
  ButtonGroup,
  CountrySelect,
  renderSelectWithCheckMark,
  CustomSelectStyles,
} from "./CustomComponents";

export function VehicleDetails({
  carState,
  handleInputChange,
  showMoreDetails,
  handleFeatureToggle,
  invalidFields
}) {
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
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "LPG", label: "LPG" },
  ];

  const powerUnitOptions = [
    { value: "kW", label: "kW" },
    { value: "hp", label: "hp" },
  ];

  const normalize = (str) => str.replace(/[\s-]+/g, "").toLowerCase();

  const renderErrorMessage = (field) => {
    if (invalidFields[field]) {
      return <p className="text-red-500 text-sm mt-1">This field is required</p>;
    }
    return null;
  };

  return (
    <div className="mr-[40px]">
      <div className="mb-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex-1">
            <label className={`block text-sm mb-2 font-semibold ${invalidFields.brand ? 'text-red-500' : ''}`}>
              More brands *
            </label>
            {renderSelectWithCheckMark(
              brandOptions,
              brandOptions.find((option) => normalize(option.value) === normalize(carState.brand)),
              (selectedOption) =>
                handleInputChange("brand", selectedOption.value),
              "Choose brand",
              false,
              invalidFields.brand
            )}
            {renderErrorMessage('brand')}
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <label className={`block text-sm mb-2 font-semibold ${invalidFields.model ? 'text-red-500' : ''}`}>
                Model *
              </label>
              {renderSelectWithCheckMark(
                modelOptions,
                modelOptions.find((option) => normalize(option.value) === normalize(carState.model)),
                (selectedOption) =>
                  handleInputChange("model", selectedOption.value),
                "Choose model",
                !carState.brand,
                invalidFields.model
              )}
              {renderErrorMessage('model')}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className={`block text-sm mb-2 font-semibold ${invalidFields.year || invalidFields.month ? 'text-red-500' : ''}`}>
          First registration *
        </label>
        <div className="mb-4">
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
            <div className="flex-1">
              {renderSelectWithCheckMark(
                yearOptions,
                yearOptions.find((option) => option.value === carState.year),
                (selectedOption) =>
                  handleInputChange("year", selectedOption.value),
                "Year",
                false,
                invalidFields.year
              )}
              {renderErrorMessage('year')}
            </div>
            <div className="flex-1">
              {renderSelectWithCheckMark(
                monthOptions,
                monthOptions.find((option) => option.value === carState.month),
                (selectedOption) =>
                  handleInputChange("month", selectedOption.value),
                "Month",
                false,
                invalidFields.month
              )}
              {renderErrorMessage('month')}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex-1">
            <label className={`block mb-2 text-sm font-semibold ${invalidFields.bodyType ? 'text-red-500' : ''}`}>
              Body Type *
            </label>
            {renderSelectWithCheckMark(
              bodyTypes,
              bodyTypes.find((option) => option.value === carState.bodyType),
              (selectedOption) =>
                handleInputChange("bodyType", selectedOption.value),
              "Body Type",
              false,
              invalidFields.bodyType
            )}
            {renderErrorMessage('bodyType')}
          </div>
          <div className="flex-1">
            <label className={`block text-sm mb-2 font-semibold ${invalidFields.mileage ? 'text-red-500' : ''}`}>
              Mileage *
            </label>
            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.mileage ? 'border-red-500' : ''}`}>
              <input
                type="number"
                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.mileage ? 'text-red-500' : ''}`}
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
            {renderErrorMessage('mileage')}
          </div>
        </div>
      </div>

      {showMoreDetails && (
        <div className="mb-16">
          <label className="block mb-2 font-bold">More details</label>
          <hr className="border-t border-gray-300 mb-4" />
          <div className="mb-4">
            <DoorSelector
              doors={carState.doors}
              handleInputChange={handleInputChange}
              isInvalid={invalidFields.doors}
            />
            {renderErrorMessage('doors')}
          </div>

          <div className="mb-4">
            <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
              <div className="flex-1">
                <label className={`block mb-2 text-sm font-semibold ${invalidFields.fuelType ? 'text-red-500' : ''}`}>
                  Fuel Type *
                </label>
                {renderSelectWithCheckMark(
                  fuelTypeOptions,
                  fuelTypeOptions.find(
                    (option) => option.value === carState.fuelType
                  ),
                  (selectedOption) =>
                    handleInputChange("fuelType", selectedOption.value),
                  "Choose fuel type",
                  false,
                  invalidFields.fuelType
                )}
                {renderErrorMessage('fuelType')}
              </div>
              <div className="flex-1">
                <label className={`block text-sm mb-2 font-semibold ${invalidFields.engineDisplacement ? 'text-red-500' : ''}`}>
                  Engine Displacement *
                </label>
                <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.engineDisplacement ? 'border-red-500' : ''}`}>
                  <input
                    type="number"
                    className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.engineDisplacement ? 'text-red-500' : ''}`}
                    placeholder="Engine Displacement"
                    value={carState.engineDisplacement}
                    onChange={(e) =>
                      handleInputChange("engineDisplacement", e.target.value)
                    }
                  />
                  <span className="text-gray-500 ml-2">L</span>
                  {carState.engineDisplacement && (
                    <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                      <GreenCheckMark />
                    </div>
                  )}
                </div>
                {renderErrorMessage('engineDisplacement')}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <label className={`block text-sm mb-2 font-semibold ${invalidFields.power ? 'text-red-500' : ''}`}>Power *</label>
            <div className="flex gap-10 items-center bg-white relative">
              <input
                type="number"
                className={`border rounded-md flex-1 p-2 focus:outline-none ${invalidFields.power ? 'border-red-500 text-red-500' : ''}`}
                placeholder="Power"
                value={carState.power}
                onChange={(e) => handleInputChange("power", e.target.value)}
              />
              <Select
                options={powerUnitOptions}
                value={powerUnitOptions.find(
                  (option) => option.value === carState.powerUnit
                )}
                onChange={(selectedOption) =>
                  handleInputChange("powerUnit", selectedOption.value)
                }
                isSearchable={false}
                styles={{
                  ...CustomSelectStyles,
                  container: (provided) => ({
                    ...provided,
                    width: "140px",
                  }),
                  control: (provided) => ({
                    ...provided,
                    minHeight: "38px",
                    ...(invalidFields.power ? { borderColor: 'rgb(239, 68, 68)', color: 'rgb(239, 68, 68)' } : {}),
                  }),
                }}
              />
              {carState.power && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <GreenCheckMark />
                </div>
              )}
            </div>
            {renderErrorMessage('power')}
          </div>

          <div className="mb-16">
            <label className="block mb-2 font-bold">Body and Interior Colors</label>
            <hr className="border-t border-gray-300 mb-4" />
            <div className="mb-4">
              <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                <div className="flex-1">
                  <TextField
                    fullWidth
                    label="Body Color"
                    type="color"
                    value={carState.bodyColor}
                    variant="outlined"
                    name="bodyColor"
                    onChange={(e) => handleInputChange("bodyColor", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    fullWidth
                    label="Interior Color"
                    type="color"
                    value={carState.interiorColor}
                    variant="outlined"
                    name="interiorColor"
                    onChange={(e) =>
                      handleInputChange("interiorColor", e.target.value)
                    }
                  />
                  </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <label className="block mb-2 font-bold">Features</label>
            <hr className="border-t border-gray-300 mb-4" />
            <div className="mb-4">
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {Object.keys(carState.features).map((feature, index) => (
                    <ToggleButton
                      size="small"
                      key={index}
                      // value={feature}
                      // selected={carState.features[feature]} // Shows selected if true
                      onChange={() => handleFeatureToggle(feature)}
                      sx={{
                        borderRadius: 2,
                        border: "1px solid",
                        backgroundColor: carState.features[feature] ? "primary.main" : "white",
                        color: carState.features[feature] ? "white" : "black",
                        borderColor: carState.features[feature] ? "primary.main" : "grey.400",
                        
                        // Default styling for larger screens
                        fontSize: "0.8rem",
                        // padding: "10px 15px",
                        
                        // Apply smaller styles for tablet (up to 960px)
                        "@media (max-width: 768px)": {
                          fontSize: "0.6rem",  // Decrease font size for tablets
                          padding: "3px 5px", // Decrease padding for smaller buttons
                        },
                        
                        // Hover styles
                        "&:hover": {
                          color: "black",
                        },
                      }}
                    >
                      {feature.replace(/([A-Z])/g, " $1").trim()}
                      {carState.features[feature] && <GreenCheckMark />}
                    </ToggleButton>
                  ))}
                </Box>
            </div>
          </div>
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
            { value: true, label: "Yes" },
            { value: false, label: "No" },
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
            { value: "private", label: "Private" },
            { value: "commercial", label: "Commercial (VAT can be shown)" },
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
            { value: "within_months", label: "Within nearest months" },
            { value: "dont_know", label: "Don't know yet" },
            { value: "asap", label: "As soon as possible" },
          ]}
          value={carState.sellPlan}
          onChange={handleInputChange}
          name="sellPlan"
          label="When do you plan to sell?"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">
          Where would you like to sell your car? *
        </label>
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
        <label className="block mb-2 text-sm font-semibold">
          Logged in as (change) *
        </label>
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
          We regularly send you emails with offers from mobile.de in connection
          with the sales process. You can object to this use for marketing
          purposes at any time via the link in the e-mail or by contacting
          customer service free of charge.
        </p>
      </div>
    </div>
  );
}
