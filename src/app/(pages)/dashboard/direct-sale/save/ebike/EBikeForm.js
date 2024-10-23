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

const ebikeBrands = [
  { value: "specialized", name: "Specialized" },
  { value: "trek", name: "Trek" },
  { value: "giant", name: "Giant" },
  { value: "cannondale", name: "Cannondale" },
  { value: "scott", name: "Scott" },
  { value: "bosch", name: "Bosch" },
  { value: "bianchi", name: "Bianchi" },
  { value: "cube", name: "Cube" },
  { value: "haibike", name: "Haibike" },
  { value: "merida", name: "Merida" }
];

const ebikeTypes = [
  { value: "city", label: "City/Commuter" },
  { value: "mountain", label: "Mountain" },
  { value: "road", label: "Road" },
  { value: "folding", label: "Folding" },
  { value: "cargo", label: "Cargo" },
  { value: "hybrid", label: "Hybrid" }
];

export default function EBikeForm() {
  const [imageupload, setImageupload] = useState(false);
  const [expandedSection, setExpandedSection] = useState('basicInfo');
  const [ebikeState, setEbikeState] = useState({
    brand: "",
    model: "",
    year: "",
    month: "",
    mileage: "",
    batteryCapacity: "",
    motorPower: "",
    maxSpeed: "",
    range: "",
    userEmail: "",
    imagesbase: [],
    price: "",
    bodyColor: "#ffffff",
    bikeType: "",
    description: "",
    frameSize: "",
    condition: "",
    features: {
      PedalAssist: false,
      ThrottleControl: false,
      RemovableBattery: false,
      IntegratedLights: false,
      DigitalDisplay: false,
      USB: false,
      Suspension: false,
      DiskBrakes: false,
      FoldingFrame: false,
      QuickCharge: false,
      WalkAssist: false,
      AntiTheft: false,
      Waterproof: false,
      AutomaticGears: false,
      SmartphoneApp: false
    },
  });

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  useEffect(() => {
    const { brand, model, year, month, mileage } = ebikeState;
    setShowMoreDetails(brand && model && year && month && mileage);
  }, [ebikeState]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/user");
      if (response.ok) {
        const userData = await response.json();
        setEbikeState((prevState) => ({
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
    const selectedBrand = ebikeBrands.find(
      (make) => make.name.toLowerCase() === brandName.toLowerCase()
    );
    setEbikeState((prevState) => ({
      ...prevState,
      brand: selectedBrand ? selectedBrand.value : brandName.toLowerCase(),
      model: ""
    }));
  };

  const handleInputChange = (field, value) => {
    setEbikeState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setInvalidFields((prevInvalidFields) => ({
      ...prevInvalidFields,
      [field]: false,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setEbikeState((prevState) => ({
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
      setEbikeState((prevState) => ({
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
      batteryCapacity,
      motorPower,
      maxSpeed,
      range,
      price,
      bikeType,
      frameSize,
      condition,
    } = ebikeState;
    
    return (
      brand &&
      model &&
      year &&
      month &&
      mileage &&
      batteryCapacity &&
      motorPower &&
      maxSpeed &&
      range &&
      price &&
      bikeType &&
      frameSize &&
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
      batteryCapacity,
      motorPower,
      maxSpeed,
      range,
      price,
      bikeType,
      frameSize,
      condition,
    } = state;

    setInvalidFields({
      brand: !brand,
      model: !model,
      year: !year,
      month: !month,
      mileage: !mileage,
      batteryCapacity: !batteryCapacity,
      motorPower: !motorPower,
      maxSpeed: !maxSpeed,
      range: !range,
      price: !price,
      bikeType: !bikeType,
      frameSize: !frameSize,
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
        body: JSON.stringify(ebikeState),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Shopify product created:", result);
        toast.success("Product created successfully in Shopify!", {
          id: toastId,
        });

        await saveToMongoDB({
          ...ebikeState,
          shopifyproduct: result.product,
          vehicleType: 'ebike'
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
  const brandOptions = ebikeBrands.map((make) => ({
    value: make.value,
    label: make.name,
  }));

  const frameSizeOptions = [
    { value: "xs", label: "XS (< 150cm)" },
    { value: "s", label: "S (150-165cm)" },
    { value: "m", label: "M (165-175cm)" },
    { value: "l", label: "L (175-185cm)" },
    { value: "xl", label: "XL (> 185cm)" }
  ];

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "used", label: "Used" },
    { value: "certified", label: "Certified Pre-Owned" }
  ];

  return (
    <>
      <div className="mb-[20px] items-center justify-between flex">
        <h3 className="font-bold uppercase text-lg">Save E-Bike</h3>
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
              <MultiImageUploadBasic onImageUpload={handleImageUpload} vehicleType="ebike" />
            </div>
            {
              imageupload && <div className="mb-4 mt-5 bg-white shadow rounded-lg p-4">
                <label className="block mb-2 font-bold">Description</label>
                <RichTextEditor
                  value={ebikeState.description}
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
                List your e-bike for sale and reach potential buyers looking for sustainable transportation options.
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
                      value={ebikeState.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                    <span className="text-gray-500 ml-2">$</span>
                    {ebikeState.price && (
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
                              value={brandOptions.find(option => option.value === ebikeState.brand)}
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
                              value={ebikeState.model}
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
                              value={yearOptions.find(option => option.value === ebikeState.year)}
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
                              value={monthOptions.find(option => option.value === ebikeState.month)}
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

                  <Accordion expanded={expandedSection === 'bikeDetails'} onChange={handleAccordionChange('bikeDetails')}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="bikeDetails-content"
                      id="bikeDetails-header"
                    >
                      <Typography>Bike Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="space-y-6">
                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block mb-2 text-sm font-semibold ${invalidFields.bikeType ? 'text-red-500' : ''}`}>
                              Bike Type *
                            </label>
                            <Select
                              options={ebikeTypes}
                              value={ebikeTypes.find(type => type.value === ebikeState.bikeType)}
                              onChange={(selected) => handleInputChange("bikeType", selected.value)}
                              className={invalidFields.bikeType ? "border-red-500" : ""}
                              placeholder="Select type"
                            />
                            {renderErrorMessage('bikeType')}
                          </div>

                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.frameSize ? 'text-red-500' : ''}`}>
                              Frame Size *
                            </label>
                            <Select
                              options={frameSizeOptions}
                              value={frameSizeOptions.find(size => size.value === ebikeState.frameSize)}
                              onChange={(selected) => handleInputChange("frameSize", selected.value)}
                              className={invalidFields.frameSize ? "border-red-500" : ""}
                              placeholder="Select frame size"
                            />
                            {renderErrorMessage('frameSize')}
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
                                value={ebikeState.mileage}
                                onChange={(e) => handleInputChange("mileage", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">km</span>
                            </div>
                            {renderErrorMessage('mileage')}
                          </div>

                          <div className="flex-1">
                            <label className={`block mb-2 text-sm font-semibold ${invalidFields.condition ? 'text-red-500' : ''}`}>
                              Condition *
                            </label>
                            <Select
                              options={conditionOptions}
                              value={conditionOptions.find(option => option.value === ebikeState.condition)}
                              onChange={(selected) => handleInputChange("condition", selected.value)}
                              className={invalidFields.condition ? "border-red-500" : ""}
                              placeholder="Select condition"
                            />
                            {renderErrorMessage('condition')}
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
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.batteryCapacity ? 'text-red-500' : ''}`}>
                              Battery Capacity *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.batteryCapacity ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.batteryCapacity ? 'text-red-500' : ''}`}
                                placeholder="Battery Capacity"
                                value={ebikeState.batteryCapacity}
                                onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">Wh</span>
                            </div>
                            {renderErrorMessage('batteryCapacity')}
                          </div>

                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.motorPower ? 'text-red-500' : ''}`}>
                              Motor Power *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.motorPower ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.motorPower ? 'text-red-500' : ''}`}
                                placeholder="Motor Power"
                                value={ebikeState.motorPower}
                                onChange={(e) => handleInputChange("motorPower", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">W</span>
                            </div>
                            {renderErrorMessage('motorPower')}
                          </div>
                        </div>

                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.maxSpeed ? 'text-red-500' : ''}`}>
                              Maximum Speed *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.maxSpeed ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.maxSpeed ? 'text-red-500' : ''}`}
                                placeholder="Maximum Speed"
                                value={ebikeState.maxSpeed}
                                onChange={(e) => handleInputChange("maxSpeed", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">km/h</span>
                            </div>
                            {renderErrorMessage('maxSpeed')}
                          </div>

                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.range ? 'text-red-500' : ''}`}>
                              Range *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.range ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.range ? 'text-red-500' : ''}`}
                                placeholder="Range"
                                value={ebikeState.range}
                                onChange={(e) => handleInputChange("range", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">km</span>
                            </div>
                            {renderErrorMessage('range')}
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
                              value={ebikeState.bodyColor}
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
                          {Object.keys(ebikeState.features).map((feature, index) => (
                            <ToggleButton
                              size="small"
                              key={index}
                              value={feature}
                              selected={ebikeState.features[feature]}
                              onChange={() => handleFeatureToggle(feature)}
                              sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                backgroundColor: ebikeState.features[feature] ? "primary.main" : "white",
                                color: ebikeState.features[feature] ? "white" : "black",
                                borderColor: ebikeState.features[feature] ? "primary.main" : "grey.400",
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
                              {ebikeState.features[feature] && <GreenCheckMark />}
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