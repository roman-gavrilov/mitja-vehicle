"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast, Toaster } from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import { carMakes } from "@/app/components/ads/carData";
import MultiImageUpload from "@/app/components/dashboard/multi-imageupload";
import PopularBrands from "./PopularBrands";
import { GreenCheckMark } from "./CustomComponents";
import { VehicleDetails } from "./FormSections";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function CarForm() {
  const [imageupload, setImageupload] = useState(false);
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
    userEmail: "",
    // images: [],
    imagesbase: [],
    price: "",
    bodyColor: "#ffffff",
    interiorColor: "#000000",
    engineDisplacement: "2.0",
    bodyType: "",
    description: "",
    features: {
      ABS: false,
      AlloyWheels: false,
      AppleCarPlay: false,
      AutoDimmingMirror: false,
      CentralLocking: false,
      DistanceWarning: false,
      ElectricWindows: false,
      ESP: false,
      AWD: false,
      HighBeamAssist: false,
      HeatedSeats: false,
      Immobilizer: false,
      Isofix: false,
      KeylessEntry: false,
      LaneAssist: false,
      LeatherSteeringWheel: false,
      LEDLights: false,
      Navigation: false,
      NonSmoker: false,
      OnBoardComputer: false,
      PaddleShifters: false,
      PowerSteering: false,
      RainSensor: false,
      RoofRack: false,
      SoundSystem: false,
      SportSeats: false,
      StartStopSystem: false,
      TractionControl: false,
      TrafficSignRecognition: false,
      Tuner: false,
      TyrePressureMonitoring: false,
      USBPort: false,
    },
  });

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});

  useEffect(() => {
    const { brand, model, year, month, mileage } = carState;
    setShowMoreDetails(brand && model && year && month && mileage);
  }, [carState]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/user");
      if (response.ok) {
        const userData = await response.json();
        setCarState((prevState) => ({
          ...prevState,
          loggedInAs: userData.fullName,
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
    const selectedBrand = carMakes.find(
      (make) => make.name.toLowerCase() === brandName.toLowerCase()
    );
    setCarState((prevState) => ({
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
    setCarState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    // Clear the invalid field status when the user makes a change
    setInvalidFields((prevInvalidFields) => ({
      ...prevInvalidFields,
      [field]: false,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setCarState((prevState) => ({
      ...prevState,
      features: {
        ...prevState.features,
        [feature]: !prevState.features[feature],
      },
    }));
  };

  const handleImageUpload = (results) => {
    console.log(results);
    setImageupload(true);
    if (results) {
      const firstImageAI = results.aiResult;
      const vehicle = firstImageAI || {};
      setCarState((prevState) => {
        const newState = {
          ...prevState,
          ...vehicle,
          imagesbase: results.base64Images,
          year: "2022",
          month: "February",
        };
        // Check form validity after updating state
        const formValid = isFormValid();
        if (!formValid) {
          highlightInvalidFields(newState);
        }
        return newState;
      });
    }
  };

  const isFormValid = () => {
    const {
      brand,
      model,
      year,
      month,
      mileage,
      doors,
      fuelType,
      power,
      price,
      engineDisplacement,
      bodyType,
    } = carState;
    return (
      brand &&
      model &&
      year &&
      month &&
      mileage &&
      doors &&
      fuelType &&
      power &&
      price &&
      engineDisplacement &&
      bodyType
    );
  };

  const highlightInvalidFields = (state) => {
    const {
      brand,
      model,
      year,
      month,
      mileage,
      doors,
      fuelType,
      power,
      price,
      engineDisplacement,
      bodyType,
    } = state;

    setInvalidFields({
      brand: !brand,
      model: !model,
      year: !year,
      month: !month,
      mileage: !mileage,
      doors: !doors,
      fuelType: !fuelType,
      power: !power,
      price: !price,
      engineDisplacement: !engineDisplacement,
      bodyType: !bodyType,
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
        body: JSON.stringify(carState),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Shopify product created:", result);
        toast.success("Product created successfully in Shopify!", {
          id: toastId,
        });

        // Save to MongoDB
        await saveToMongoDB({
          ...carState,
          shopifyproduct: result.product, // Assuming the Shopify API returns the product ID
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

  return (
    <>
      <div className="mb-[20px] items-center justify-between flex">
        <h3 className="font-bold uppercase text-lg">Save Vehicle</h3>
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
          <div className="sticky top-4 bg-white shadow p-4 rounded-lg">
            <div className="mb-8">
              <MultiImageUpload onImageUpload={handleImageUpload} />
            </div>
          </div>
        </div>
        {imageupload && (
          <div className="md:w-2/3 p-0 md:p-4 w-full fields">
            <div className="max-w-5xl mx-auto p-4 md:p-10 bg-white shadow rounded-lg">
              <Toaster />
              <p className="mb-6">
                Offer your car to over 14 million potential buyers. Take control
                of the sale yourself and use your negotiating skills to achieve
                the best possible sale price!
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
                      value={carState.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                    <span className="text-gray-500 ml-2">$</span>
                    {carState.price && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                        <GreenCheckMark />
                      </div>
                    )}
                  </div>
                </div>

                <PopularBrands
                  handleBrandClick={handleBrandClick}
                  selectedBrand={carState.brand}
                />
                <VehicleDetails
                  carState={carState}
                  handleInputChange={handleInputChange}
                  showMoreDetails={showMoreDetails}
                  handleFeatureToggle={handleFeatureToggle}
                  invalidFields={invalidFields}
                />
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
