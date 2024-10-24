"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast, Toaster } from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import MultiImageUploadBasic from "@/app/components/dashboard/multi-imageupload-basic";
import { GreenCheckMark } from "../CustomComponents";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RichTextEditor from "@/app/components/RichTextEditor";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  ToggleButton
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { monthOptions, getYearOptions } from "@/app/components/ads/carData";

const motorHomeBrands = [
  { value: "winnebago", name: "Winnebago" },
  { value: "thor", name: "Thor Motor Coach" },
  { value: "forest_river", name: "Forest River" },
  { value: "coachmen", name: "Coachmen" },
  { value: "airstream", name: "Airstream" },
  { value: "jayco", name: "Jayco" },
  { value: "fleetwood", name: "Fleetwood RV" },
  { value: "leisure_travel", name: "Leisure Travel Vans" },
  { value: "newmar", name: "Newmar" },
  { value: "tiffin", name: "Tiffin Motorhomes" }
];

const motorHomeTypes = [
  { value: "class_a", label: "Class A" },
  { value: "class_b", label: "Class B" },
  { value: "class_c", label: "Class C" },
  { value: "micro", label: "Micro/Compact" },
  { value: "super_c", label: "Super C" },
  { value: "toy_hauler", label: "Toy Hauler" }
];

export default function MotorHomeForm() {
  const [imageupload, setImageupload] = useState(false);
  const [expandedSection, setExpandedSection] = useState('basicInfo');
  const [motorHomeState, setMotorHomeState] = useState({
    brand: "",
    model: "",
    year: "",
    month: "",
    mileage: "",
    length: "",
    sleeps: "",
    fuelType: "",
    engineSize: "",
    transmission: "",
    userEmail: "",
    imagesbase: [],
    price: "",
    bodyColor: "#ffffff",
    motorHomeType: "",
    description: "",
    condition: "",
    features: {
      Slideouts: false,
      SolarPanels: false,
      Generator: false,
      AirConditioning: false,
      Heating: false,
      Bathroom: false,
      Kitchen: false,
      Shower: false,
      TVAntenna: false,
      Awning: false,
      BackupCamera: false,
      NavigationSystem: false,
      PowerStabilizers: false,
      WaterHeater: false,
      PowerWindows: false
    },
  });

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  useEffect(() => {
    const { brand, model, year, month, mileage } = motorHomeState;
    setShowMoreDetails(brand && model && year && month && mileage);
  }, [motorHomeState]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/user");
      if (response.ok) {
        const userData = await response.json();
        setMotorHomeState((prevState) => ({
          ...prevState,
          userEmail: userData.email,
        }));
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleBrandClick = (brandName) => {
    const selectedBrand = motorHomeBrands.find(
      (make) => make.name.toLowerCase() === brandName.toLowerCase()
    );
    setMotorHomeState((prevState) => ({
      ...prevState,
      brand: selectedBrand ? selectedBrand.value : brandName.toLowerCase(),
      model: ""
    }));
  };

  const handleInputChange = (field, value) => {
    setMotorHomeState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setInvalidFields((prevInvalidFields) => ({
      ...prevInvalidFields,
      [field]: false,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setMotorHomeState((prevState) => ({
      ...prevState,
      features: {
        ...prevState.features,
        [feature]: !prevState.features[feature],
      },
    }));
  };

  const handleImageUpload = (results) => {
    setImageupload(true);
    if (results && results.base64Images) {
      setMotorHomeState((prevState) => ({
        ...prevState,
        imagesbase: results.base64Images
      }));
    }
  };

  const isFormValid = () => {
    const {
      brand,
      model,
      year,
      month,
      mileage,
      length,
      sleeps,
      fuelType,
      engineSize,
      transmission,
      price,
      motorHomeType,
      condition,
    } = motorHomeState;
    
    return (
      brand &&
      model &&
      year &&
      month &&
      mileage &&
      length &&
      sleeps &&
      fuelType &&
      engineSize &&
      transmission &&
      price &&
      motorHomeType &&
      condition
    );
  };

  const highlightInvalidFields = (state) => {
    const {
      brand,
      model,
      year,
      month,
      mileage,
      length,
      sleeps,
      fuelType,
      engineSize,
      transmission,
      price,
      motorHomeType,
      condition,
    } = state;

    setInvalidFields({
      brand: !brand,
      model: !model,
      year: !year,
      month: !month,
      mileage: !mileage,
      length: !length,
      sleeps: !sleeps,
      fuelType: !fuelType,
      engineSize: !engineSize,
      transmission: !transmission,
      price: !price,
      motorHomeType: !motorHomeType,
      condition: !condition,
    });
  };

  const saveToMongoDB = async (productData) => {
    try {
      const response = await fetch("/api/dashboard/savelists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        console.log("Product saved to MongoDB successfully");
      } else {
        console.error("Failed to save product to MongoDB");
      }
    } catch (error) {
      console.error("Error saving product to MongoDB:", error);
    }
  };

  const createShopifyProduct = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Creating Product...", {
      position: "top-center",
    });
    try {
      const response = await fetch("/api/shopify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(motorHomeState),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Shopify product created:", result);
        toast.success("Product created successfully in Shopify!", {
          id: toastId,
        });

        await saveToMongoDB({
          ...motorHomeState,
          shopifyproduct: result.product,
          vehicleType: 'motorhome'
        });

        location.href = "/dashboard/direct-sale";
      } else {
        console.error("Failed to create Shopify product");
        toast.error("Failed to create product in Shopify. Please try again.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error creating Shopify product:", error);
      toast.error(
        "An error occurred while creating the product. Please try again.",
        {
          id: toastId,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorMessage = (field) => {
    if (invalidFields[field]) {
      return <p className="text-red-500 text-sm mt-1">This field is required</p>;
    }
    return null;
  };

  const yearOptions = getYearOptions();
  const brandOptions = motorHomeBrands.map((make) => ({
    value: make.value,
    label: make.name,
  }));

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "used", label: "Used" },
    { value: "certified", label: "Certified Pre-Owned" }
  ];

  const fuelTypeOptions = [
    { value: "diesel", label: "Diesel" },
    { value: "gasoline", label: "Gasoline" },
    { value: "hybrid", label: "Hybrid" },
    { value: "electric", label: "Electric" }
  ];

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" }
  ];

  return (
    <>
      <div className="mb-[20px] items-center justify-between flex">
        <h3 className="font-bold uppercase text-lg">Save Motor Home</h3>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            disabled={!isFormValid() || isLoading}
            onClick={createShopifyProduct}
          >
            {isLoading ? (
              <>
                <span className="ml-2">Creating...</span>
              </>
            ) : (
              "Create"
            )}
          </Button>
        </Stack>
      </div>
      <div className="w-full flex flex-wrap">
        <div
          className={`${
            !imageupload ? "w-full" : "md:w-1/3"
          } mb-5 p-0 md:p-4 w-full imageupload transition-all duration-500`}
        >
          <div className="md:sticky relative top-4">
            <div className="bg-white shadow rounded-lg p-4">
              <MultiImageUploadBasic onImageUpload={handleImageUpload} vehicleType="motorhome" />
            </div>
            {
              imageupload && <div className="mb-4 mt-5 bg-white shadow rounded-lg p-4">
                <label className="block mb-2 font-bold">Description</label>
                <RichTextEditor
                  value={motorHomeState.description}
                  onEditorChange={(content) => handleInputChange("description", content)}
                />
              </div>
            }
          </div>
        </div>
        {imageupload && (
          <div className="md:w-2/3 p-0 md:p-4 w-full fields">
            <div className="max-w-5xl mx-auto p-4 md:p-10 bg-white shadow rounded-lg">
              <Toaster />
              <p className="mb-6">
                List your motor home for sale and reach potential buyers looking for their perfect home on wheels.
                Provide detailed information to help buyers make an informed decision!
              </p>
              <div className="w-full">
                <div className="mb-10 mr-[40px]">
                  <label
                    className={`block text-sm mb-2 font-semibold ${invalidFields.price ? "text-red-500" : ""}`}
                  >
                    Sell Price *
                  </label>
                  <div
                    className={`flex items-center border rounded-md p-1 pr-[10px] bg-white relative ${invalidFields.price ? "border-red-500" : ""}`}
                  >
                    <input
                      type="number"
                      className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.price ? "text-red-500" : ""}`}
                      placeholder="Price"
                      value={motorHomeState.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                    <span className="text-gray-500 ml-2">$</span>
                    {motorHomeState.price && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                        <GreenCheckMark />
                      </div>
                    )}
                  </div>
                </div>

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
                      <div className="space-y-6">
                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.brand ? 'text-red-500' : ''}`}>
                              Brand *
                            </label>
                            <Select
                              options={brandOptions}
                              value={brandOptions.find(option => option.value === motorHomeState.brand)}
                              onChange={(selected) => handleInputChange("brand", selected.value)}
                              className={invalidFields.brand ? "border-red-500" : ""}
                              placeholder="Choose brand"
                            />
                            {renderErrorMessage('brand')}
                          </div>
                          
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.model ? 'text-red-500' : ''}`}>
                              Model *
                            </label>
                            <input
                              type="text"
                              className={`w-full p-2 border rounded-md ${invalidFields.model ? 'border-red-500' : ''}`}
                              placeholder="Enter model"
                              value={motorHomeState.model}
                              onChange={(e) => handleInputChange("model", e.target.value)}
                            />
                            {renderErrorMessage('model')}
                          </div>
                        </div>

                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.year ? 'text-red-500' : ''}`}>
                              Year *
                            </label>
                            <Select
                              options={yearOptions}
                              value={yearOptions.find(option => option.value === motorHomeState.year)}
                              onChange={(selected) => handleInputChange("year", selected.value)}
                              className={invalidFields.year ? "border-red-500" : ""}
                              placeholder="Year"
                            />
                            {renderErrorMessage('year')}
                          </div>
                          
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.month ? 'text-red-500' : ''}`}>
                              Month *
                            </label>
                            <Select
                              options={monthOptions}
                              value={monthOptions.find(option => option.value === motorHomeState.month)}
                              onChange={(selected) => handleInputChange("month", selected.value)}
                              className={invalidFields.month ? "border-red-500" : ""}
                              placeholder="Month"
                            />
                            {renderErrorMessage('month')}
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
                      <div className="space-y-6">
                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block mb-2 text-sm font-semibold ${invalidFields.motorHomeType ? 'text-red-500' : ''}`}>
                              Motor Home Type *
                            </label>
                            <Select
                              options={motorHomeTypes}
                              value={motorHomeTypes.find(type => type.value === motorHomeState.motorHomeType)}
                              onChange={(selected) => handleInputChange("motorHomeType", selected.value)}
                              className={invalidFields.motorHomeType ? "border-red-500" : ""}
                              placeholder="Select type"
                            />
                            {renderErrorMessage('motorHomeType')}
                          </div>

                          <div className="flex-1">
                            <label className={`block mb-2 text-sm font-semibold ${invalidFields.condition ? 'text-red-500' : ''}`}>
                              Condition *
                            </label>
                            <Select
                              options={conditionOptions}
                              value={conditionOptions.find(option => option.value === motorHomeState.condition)}
                              onChange={(selected) => handleInputChange("condition", selected.value)}
                              className={invalidFields.condition ? "border-red-500" : ""}
                              placeholder="Select condition"
                            />
                            {renderErrorMessage('condition')}
                          </div>
                        </div>

                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.mileage ? 'text-red-500' : ''}`}>
                              Mileage *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.mileage ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.mileage ? 'text-red-500' : ''}`}
                                placeholder="Mileage"
                                value={motorHomeState.mileage}
                                onChange={(e) => handleInputChange("mileage", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">km</span>
                            </div>
                            {renderErrorMessage('mileage')}
                          </div>

                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.length ? 'text-red-500' : ''}`}>
                              Length *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.length ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.length ? 'text-red-500' : ''}`}
                                placeholder="Length"
                                value={motorHomeState.length}
                                onChange={(e) => handleInputChange("length", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">ft</span>
                            </div>
                            {renderErrorMessage('length')}
                          </div>
                        </div>
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
                      <div className="space-y-6">
                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.engineSize ? 'text-red-500' : ''}`}>
                              Engine Size *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.engineSize ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.engineSize ? 'text-red-500' : ''}`}
                                placeholder="Engine Size"
                                value={motorHomeState.engineSize}
                                onChange={(e) => handleInputChange("engineSize", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">L</span>
                            </div>
                            {renderErrorMessage('engineSize')}
                          </div>

                          <div className="flex-1">
                            <label className={`block mb-2 text-sm font-semibold ${invalidFields.fuelType ? 'text-red-500' : ''}`}>
                              Fuel Type *
                            </label>
                            <Select
                              options={fuelTypeOptions}
                              value={fuelTypeOptions.find(option => option.value === motorHomeState.fuelType)}
                              onChange={(selected) => handleInputChange("fuelType", selected.value)}
                              className={invalidFields.fuelType ? "border-red-500" : ""}
                              placeholder="Select fuel type"
                            />
                            {renderErrorMessage('fuelType')}
                          </div>
                        </div>

                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block mb-2 text-sm font-semibold ${invalidFields.transmission ? 'text-red-500' : ''}`}>
                              Transmission *
                            </label>
                            <Select
                              options={transmissionOptions}
                              value={transmissionOptions.find(option => option.value === motorHomeState.transmission)}
                              onChange={(selected) => handleInputChange("transmission", selected.value)}
                              className={invalidFields.transmission ? "border-red-500" : ""}
                              placeholder="Select transmission"
                            />
                            {renderErrorMessage('transmission')}
                          </div>

                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.sleeps ? 'text-red-500' : ''}`}>
                              Sleeps *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.sleeps ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.sleeps ? 'text-red-500' : ''}`}
                                placeholder="Number of people"
                                value={motorHomeState.sleeps}
                                onChange={(e) => handleInputChange("sleeps", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">people</span>
                            </div>
                            {renderErrorMessage('sleeps')}
                          </div>
                        </div>
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
                              value={motorHomeState.bodyColor}
                              variant="outlined"
                              name="bodyColor"
                              onChange={(e) => handleInputChange("bodyColor", e.target.value)}
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
                          {Object.keys(motorHomeState.features).map((feature, index) => (
                            <ToggleButton
                              size="small"
                              key={index}
                              value={feature}
                              selected={motorHomeState.features[feature]}
                              onChange={() => handleFeatureToggle(feature)}
                              sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                backgroundColor: motorHomeState.features[feature] ? "primary.main" : "white",
                                color: motorHomeState.features[feature] ? "white" : "black",
                                borderColor: motorHomeState.features[feature] ? "primary.main" : "grey.400",
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
                              {motorHomeState.features[feature] && <GreenCheckMark />}
                            </ToggleButton>
                          ))}
                        </Box>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>

              <div className="mt-[100px]">
                <Stack justifyContent="end" direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    disabled={!isFormValid() || isLoading}
                    onClick={createShopifyProduct}
                  >
                    {isLoading ? (
                      <>
                        <span className="ml-2">Creating...</span>
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </Stack>
              </div>

              {isLoading && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center">
                  <Circles
                    height="100"
                    width="100"
                    color="#ffffff"
                    ariaLabel="circles-loading"
                    visible={true}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}