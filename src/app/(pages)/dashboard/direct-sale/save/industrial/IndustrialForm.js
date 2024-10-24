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

const industrialBrands = [
  { value: "caterpillar", name: "Caterpillar" },
  { value: "volvo", name: "Volvo" },
  { value: "komatsu", name: "Komatsu" },
  { value: "jcb", name: "JCB" },
  { value: "hitachi", name: "Hitachi" },
  { value: "john_deere", name: "John Deere" },
  { value: "bobcat", name: "Bobcat" },
  { value: "liebherr", name: "Liebherr" },
  { value: "case", name: "Case" },
  { value: "doosan", name: "Doosan" }
];

const subTypes = {
  excavator: [
    { value: "mini", label: "Mini Excavator" },
    { value: "crawler", label: "Crawler Excavator" },
    { value: "wheeled", label: "Wheeled Excavator" },
    { value: "long_reach", label: "Long Reach Excavator" }
  ],
  crane: [
    { value: "mobile", label: "Mobile Crane" },
    { value: "tower", label: "Tower Crane" },
    { value: "crawler", label: "Crawler Crane" },
    { value: "rough_terrain", label: "Rough Terrain Crane" }
  ],
  forklift: [
    { value: "electric", label: "Electric Forklift" },
    { value: "diesel", label: "Diesel Forklift" },
    { value: "lpg", label: "LPG Forklift" },
    { value: "reach", label: "Reach Truck" }
  ],
  loader: [
    { value: "wheel", label: "Wheel Loader" },
    { value: "skid_steer", label: "Skid Steer Loader" },
    { value: "compact", label: "Compact Loader" },
    { value: "telescopic", label: "Telescopic Handler" }
  ],
  dump_truck: [
    { value: "articulated", label: "Articulated Dump Truck" },
    { value: "rigid", label: "Rigid Dump Truck" },
    { value: "mining", label: "Mining Dump Truck" }
  ],
  truck: [
    { value: "heavy_duty", label: "Heavy Duty Truck" },
    { value: "medium_duty", label: "Medium Duty Truck" },
    { value: "light_duty", label: "Light Duty Truck" },
    { value: "special_purpose", label: "Special Purpose Truck" }
  ],
  construction: [
    { value: "bulldozer", label: "Bulldozer" },
    { value: "grader", label: "Grader" },
    { value: "roller", label: "Roller" },
    { value: "paver", label: "Paver" }
  ],
  agricultural: [
    { value: "tractor", label: "Tractor" },
    { value: "harvester", label: "Harvester" },
    { value: "sprayer", label: "Sprayer" },
    { value: "planter", label: "Planter" }
  ],
  industrial_equipment: [
    { value: "generator", label: "Generator" },
    { value: "compressor", label: "Compressor" },
    { value: "pump", label: "Pump" },
    { value: "drill", label: "Drill" }
  ]
};

export default function IndustrialForm({ vehicleType }) {
  const [imageupload, setImageupload] = useState(false);
  const [expandedSection, setExpandedSection] = useState('basicInfo');
  const [industrialState, setIndustrialState] = useState({
    brand: "",
    model: "",
    year: "",
    month: "",
    mileage: "",
    engineHours: "",
    powerOutput: "",
    maxLoad: "",
    operatingWeight: "",
    userEmail: "",
    imagesbase: [],
    price: "",
    bodyColor: "#ffffff",
    vehicleType: vehicleType?.toLowerCase().replace(' ', '_') || "",
    subType: "",
    description: "",
    condition: "",
    features: {
      GPSTracking: false,
      AutomaticTransmission: false,
      AirConditioning: false,
      HeatedCabin: false,
      ReverseCamera: false,
      LoadSensing: false,
      Telematics: false,
      QuickCoupler: false,
      BucketOptions: false,
      SafetyLights: false,
      EmergencyStop: false,
      TiltCabin: false,
      RolloverProtection: false,
      FallProtection: false,
      RemoteDiagnostics: false
    },
  });

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  useEffect(() => {
    const { brand, model, year, month, mileage } = industrialState;
    setShowMoreDetails(brand && model && year && month && mileage);
  }, [industrialState]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/user");
      if (response.ok) {
        const userData = await response.json();
        setIndustrialState((prevState) => ({
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
    const selectedBrand = industrialBrands.find(
      (make) => make.name.toLowerCase() === brandName.toLowerCase()
    );
    setIndustrialState((prevState) => ({
      ...prevState,
      brand: selectedBrand ? selectedBrand.value : brandName.toLowerCase(),
      model: ""
    }));
  };

  const handleInputChange = (field, value) => {
    setIndustrialState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setInvalidFields((prevInvalidFields) => ({
      ...prevInvalidFields,
      [field]: false,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setIndustrialState((prevState) => ({
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
      setIndustrialState((prevState) => ({
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
      engineHours,
      powerOutput,
      maxLoad,
      operatingWeight,
      price,
      condition,
    } = industrialState;
    
    return (
      brand &&
      model &&
      year &&
      month &&
      mileage &&
      engineHours &&
      powerOutput &&
      maxLoad &&
      operatingWeight &&
      price &&
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
      engineHours,
      powerOutput,
      maxLoad,
      operatingWeight,
      price,
      condition,
    } = state;

    setInvalidFields({
      brand: !brand,
      model: !model,
      year: !year,
      month: !month,
      mileage: !mileage,
      engineHours: !engineHours,
      powerOutput: !powerOutput,
      maxLoad: !maxLoad,
      operatingWeight: !operatingWeight,
      price: !price,
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
        body: JSON.stringify(industrialState),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Shopify product created:", result);
        toast.success("Product created successfully in Shopify!", {
          id: toastId,
        });

        await saveToMongoDB({
          ...industrialState,
          shopifyproduct: result.product,
          vehicleType: 'industrial'
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
  const brandOptions = industrialBrands.map((make) => ({
    value: make.value,
    label: make.name,
  }));

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "used", label: "Used" },
    { value: "certified", label: "Certified Pre-Owned" }
  ];

  return (
    <>
      <div className="mb-[20px] items-center justify-between flex">
        <h3 className="font-bold uppercase text-lg">Save {vehicleType}</h3>
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
              <MultiImageUploadBasic onImageUpload={handleImageUpload} vehicleType="industrial" />
            </div>
            {
              imageupload && <div className="mb-4 mt-5 bg-white shadow rounded-lg p-4">
                <label className="block mb-2 font-bold">Description</label>
                <RichTextEditor
                  value={industrialState.description}
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
                List your {vehicleType.toLowerCase()} for sale and reach potential buyers in the construction and industrial sector.
                Provide detailed specifications to help buyers make an informed decision!
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
                      value={industrialState.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                    <span className="text-gray-500 ml-2">$</span>
                    {industrialState.price && (
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
                              value={brandOptions.find(option => option.value === industrialState.brand)}
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
                              value={industrialState.model}
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
                              value={yearOptions.find(option => option.value === industrialState.year)}
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
                              value={monthOptions.find(option => option.value === industrialState.month)}
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
                        {subTypes[industrialState.vehicleType] && (
                          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                            <div className="flex-1">
                              <label className="block text-sm mb-2 font-semibold">
                                Sub Type
                              </label>
                              <Select
                                options={subTypes[industrialState.vehicleType]}
                                value={subTypes[industrialState.vehicleType]?.find(
                                  type => type.value === industrialState.subType
                                )}
                                onChange={(selected) => handleInputChange("subType", selected.value)}
                                placeholder="Select sub type"
                              />
                            </div>
                          </div>
                        )}

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
                                value={industrialState.mileage}
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
                              value={conditionOptions.find(option => option.value === industrialState.condition)}
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
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.engineHours ? 'text-red-500' : ''}`}>
                              Engine Hours *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.engineHours ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.engineHours ? 'text-red-500' : ''}`}
                                placeholder="Engine Hours"
                                value={industrialState.engineHours}
                                onChange={(e) => handleInputChange("engineHours", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">hrs</span>
                            </div>
                            {renderErrorMessage('engineHours')}
                          </div>

                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.powerOutput ? 'text-red-500' : ''}`}>
                              Power Output *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.powerOutput ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.powerOutput ? 'text-red-500' : ''}`}
                                placeholder="Power Output"
                                value={industrialState.powerOutput}
                                onChange={(e) => handleInputChange("powerOutput", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">hp</span>
                            </div>
                            {renderErrorMessage('powerOutput')}
                          </div>
                        </div>

                        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.maxLoad ? 'text-red-500' : ''}`}>
                              Maximum Load Capacity *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.maxLoad ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.maxLoad ? 'text-red-500' : ''}`}
                                placeholder="Maximum Load"
                                value={industrialState.maxLoad}
                                onChange={(e) => handleInputChange("maxLoad", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">tons</span>
                            </div>
                            {renderErrorMessage('maxLoad')}
                          </div>

                          <div className="flex-1">
                            <label className={`block text-sm mb-2 font-semibold ${invalidFields.operatingWeight ? 'text-red-500' : ''}`}>
                              Operating Weight *
                            </label>
                            <div className={`flex items-center border rounded-md pr-[10px] bg-white relative ${invalidFields.operatingWeight ? 'border-red-500' : ''}`}>
                              <input
                                type="number"
                                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.operatingWeight ? 'text-red-500' : ''}`}
                                placeholder="Operating Weight"
                                value={industrialState.operatingWeight}
                                onChange={(e) => handleInputChange("operatingWeight", e.target.value)}
                              />
                              <span className="text-gray-500 ml-2">tons</span>
                            </div>
                            {renderErrorMessage('operatingWeight')}
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
                              value={industrialState.bodyColor}
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
                          {Object.keys(industrialState.features).map((feature, index) => (
                            <ToggleButton
                              size="small"
                              key={index}
                              value={feature}
                              selected={industrialState.features[feature]}
                              onChange={() => handleFeatureToggle(feature)}
                              sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                backgroundColor: industrialState.features[feature] ? "primary.main" : "white",
                                color: industrialState.features[feature] ? "white" : "black",
                                borderColor: industrialState.features[feature] ? "primary.main" : "grey.400",
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
                              {industrialState.features[feature] && <GreenCheckMark />}
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