"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast, Toaster } from 'react-hot-toast';
import { Circles } from 'react-loader-spinner';
import {
  popularBrands,
  carMakes,
  carModels,
  getYearOptions,
  monthOptions,
} from "@/app/components/ads/carData";
import MultiImageUpload from "@/app/components/dashboard/multi-imageupload";
import PopularBrands from "./PopularBrands";
import { GreenCheckMark, DoorSelector, ButtonGroup, CountrySelect } from "./CustomComponents";
import { VehicleDetails } from "./FormSections";

export default function CarForm() {
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
  });

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { brand, model, year, month, mileage } = carState;
    setShowMoreDetails(brand && model && year && month && mileage);
  }, [carState]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setCarState(prevState => ({
          ...prevState,
          loggedInAs: userData.fullName,
          userEmail: userData.email,
        }));
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

  const handleImageUpload = (results) => {
    console.log(results);
    if (results) {
      const firstImageAI = results.aiResult;
      const vehicle = firstImageAI.vehicle || {};
      setCarState(prevState => ({
        ...prevState,
        brand: vehicle.brand?.toLowerCase() || prevState.brand,
        model: vehicle.model || prevState.model,
        doors: vehicle.doors?.toString() || prevState.doors,
        fuelType: vehicle.fuel_type || prevState.fuelType,
        mileage: vehicle.mileage || prevState.mileage,
        power: vehicle.power || prevState.power,
        // images: results.images,
        imagesbase: results.base64Images,
        year: '2022',
        month: 'February'
      }));
    }
  };

  const isFormValid = () => {
    const { brand, model, year, month, mileage, doors, fuelType, power, price } = carState;
    return brand && model && year && month && mileage && doors && fuelType && power && price;
  };

  const saveToMongoDB = async (productData) => {
    try {
      const response = await fetch('/api/dashboard/savelists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        console.log('Product saved to MongoDB successfully');
      } else {
        console.error('Failed to save product to MongoDB');
      }
    } catch (error) {
      console.error('Error saving product to MongoDB:', error);
    }
  };

  const createShopifyProduct = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Creating Product...', {
      position: 'top-center',
    });
    try {
      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carState),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Shopify product created:', result);
        toast.success('Product created successfully in Shopify!', {
          id: toastId,
        });

        // Save to MongoDB
        await saveToMongoDB({
          ...carState,
          shopifyproduct: result.product, // Assuming the Shopify API returns the product ID
        });

        location.href = '/dashboard/direct-sale';

      } else {
        console.error('Failed to create Shopify product');
        toast.error('Failed to create product in Shopify. Please try again.', {
          id: toastId,
        });
      }
    } catch (error) {
      console.error('Error creating Shopify product:', error);
      toast.error('An error occurred while creating the product. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-10 bg-white shadow rounded-lg">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">By listing or Direct-Sale</h1>
      <p className="mb-6">
        Offer your car to over 14 million potential buyers. Take control of the
        sale yourself and use your negotiating skills to achieve the best
        possible sale price!
      </p>
      <div className="w-3/4">
        <div className="mb-8">
          <h2 className="font-semibold text-sm mb-4">Upload Vehicle Images *</h2>
          <MultiImageUpload onImageUpload={handleImageUpload} />
        </div>

        <div className="mb-10">
          <label className="block text-sm mb-2 font-semibold">Price *</label>
          <div className="flex items-center border rounded-md p-1 pr-[10px] bg-white relative">
            <input
              type="number"
              className="border-none flex-1 p-2 focus:outline-none"
              placeholder="Price"
              value={carState.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            <span className="text-gray-500 ml-2">$</span>
            {carState.price && (
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                <GreenCheckMark />
              </div>
            )}
          </div>
        </div>

        <PopularBrands handleBrandClick={handleBrandClick} selectedBrand={carState.brand} />
        <VehicleDetails
          carState={carState}
          handleInputChange={handleInputChange}
          showMoreDetails={showMoreDetails}
        />
      </div>
      <div className="mt-[100px]">
        <button 
          className={`${
            isFormValid() && !isLoading
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gray-300 cursor-not-allowed"
          } text-white font-bold py-2 px-4 rounded w-full transition-colors duration-300 flex items-center justify-center`}
          disabled={!isFormValid() || isLoading}
          onClick={createShopifyProduct}
        >
          {isLoading ? (
            <>
              <span className="ml-2">Creating...</span>
            </>
          ) : (
            'Create'
          )}
        </button>
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
  );
}