import React, { useState } from "react";
import Select from "react-select";
import {
  carMakes,
  carModels,
  getYearOptions,
  monthOptions,
  bodyTypes,
} from "@/app/components/ads/carData";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  GreenCheckMark,
  DoorSelector,
  TransmissionSelector,
  ButtonGroup,
  CountrySelect,
  renderSelectWithCheckMark,
  CustomSelectStyles,
} from "../CustomComponents";
import RichTextEditor from "@/app/components/RichTextEditor";

export function VehicleDetails({
  carState,
  handleInputChange,
  showMoreDetails,
  handleFeatureToggle,
  invalidFields
}) {
  const [expandedSection, setExpandedSection] = useState('basicInfo');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
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

  const conditionOptions = [
    { value: "New", label: "New" },
    { value: "Used", label: "Used" },
  ];

  const normalize = (str) => str.replace(/[\s-]+/g, "").toLowerCase();

  const renderErrorMessage = (field) => {
    if (invalidFields[field]) {
      return <p className="text-red-500 text-sm mt-1">This field is required</p>;
    }
    return null;
  };

  return (
    <div className="w-full">
      <Accordion expanded={expandedSection === 'basicInfo'} onChange={handleAccordionChange('basicInfo')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="basicInfo-content"
          id="basicInfo-header"
        >
          <Typography>Basic Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-4 mr-[40px]">
            <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
              <div className="flex-1">
                <label className={`block text-sm mb-2 font-semibold ${invalidFields.brand ? 'text-red-500' : ''}`}>
                  Brand *
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

          <div className="mb-4 mr-[40px]">
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
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedSection === 'vehicleDetails'} onChange={handleAccordionChange('vehicleDetails')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="vehicleDetails-content"
          id="vehicleDetails-header"
        >
          <Typography>Vehicle Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-4 mr-[40px]">
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

          <div className="mb-4 mr-[40px]">
            <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
              <div className="flex-1">
                <label className={`block mb-2 text-sm font-semibold ${invalidFields.numberOfOwners ? 'text-red-500' : ''}`}>
                  Number of Owners *
                </label>
                <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.numberOfOwners ? 'border-red-500' : ''}`}>
                  <input
                    type="number"
                    className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.numberOfOwners ? 'text-red-500' : ''}`}
                    placeholder="Number of Owners"
                    value={carState.numberOfOwners}
                    onChange={(e) => handleInputChange("numberOfOwners", e.target.value)}
                  />
                  {carState.numberOfOwners && (
                    <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                      <GreenCheckMark />
                    </div>
                  )}
                </div>
                {renderErrorMessage('numberOfOwners')}
              </div>
              <div className="flex-1">
                <label className={`block mb-2 text-sm font-semibold ${invalidFields.condition ? 'text-red-500' : ''}`}>
                  Condition *
                </label>
                {renderSelectWithCheckMark(
                  conditionOptions,
                  conditionOptions.find((option) => option.value === carState.condition),
                  (selectedOption) =>
                    handleInputChange("condition", selectedOption.value),
                  "Select condition",
                  false,
                  invalidFields.condition
                )}
                {renderErrorMessage('condition')}
              </div>
            </div>
          </div>

          <div className="mb-4 mr-[40px]">
            <DoorSelector
              doors={carState.doors}
              handleInputChange={handleInputChange}
              isInvalid={invalidFields.doors}
            />
            {renderErrorMessage('doors')}
          </div>

          <div className="mb-4 mr-[40px]">
            <TransmissionSelector
              transmissiontype={carState.transmissiontype}
              handleInputChange={handleInputChange}
              isInvalid={invalidFields.transmissiontype}
            />
            {renderErrorMessage('transmissiontype')}
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedSection === 'technicalSpecs'} onChange={handleAccordionChange('technicalSpecs')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="technicalSpecs-content"
          id="technicalSpecs-header"
        >
          <Typography>Technical Specifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-4 mr-[40px]">
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

          <div className="mb-4 mr-[40px]">
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
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedSection === 'colors'} onChange={handleAccordionChange('colors')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="colors-content"
          id="colors-header"
        >
          <Typography>Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-16">
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
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedSection === 'features'} onChange={handleAccordionChange('features')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="features-content"
          id="features-header"
        >
          <Typography>Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-16">
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Object.keys(carState.features).map((feature, index) => (
                <ToggleButton
                  size="small"
                  key={index}
                  onChange={() => handleFeatureToggle(feature)}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    backgroundColor: carState.features[feature] ? "primary.main" : "white",
                    color: carState.features[feature] ? "white" : "black",
                    borderColor: carState.features[feature] ? "primary.main" : "grey.400",
                    fontSize: "0.8rem",
                    "@media (max-width: 768px)": {
                      fontSize: "0.6rem",
                      padding: "3px 5px",
                    },
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

// ... (keep the FurtherInformation component as is)