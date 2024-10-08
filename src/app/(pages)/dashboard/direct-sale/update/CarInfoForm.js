"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast, Toaster } from 'react-hot-toast';
import { Circles } from 'react-loader-spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  carMakes,
} from "@/app/components/ads/carData";
import MultiImageUpload from "@/app/components/dashboard/multi-imageupload";
import PopularBrands from "../save/PopularBrands";
import { GreenCheckMark } from "../save/CustomComponents";
import { VehicleDetails } from "../save/FormSections";

export default function CarInfoForm({ carId }) {
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
    imagesbase: [],
    price: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    fetchCarData();
    fetchUserData();
  }, [carId]);

  const fetchCarData = async () => {
    setIsDataLoading(true);
    try {
      const response = await fetch(`/api/dashboard/savelists/${carId}`);
      if (response.ok) {
        const {car:carData} = await response.json();
        setCarState(prevState => ({
          ...prevState,
          ...carData,
        }));
      } else {
        console.error('Failed to fetch car data');
        toast.error('Failed to load car information. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching car data:', error);
      toast.error('An error occurred while loading car information. Please try again.');
    } finally {
      setIsDataLoading(false);
    }
  };

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
    if (results) {
      setCarState(prevState => ({
        ...prevState,
        imagesbase: results.base64Images,
      }));
    }
  };

  const isFormValid = () => {
    const { brand, model, year, month, mileage, doors, fuelType, power, price } = carState;
    return brand && model && year && month && mileage && doors && fuelType && power && price;
  };

  const updateShopifyProduct = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Updating Product...', {
      position: 'top-center',
    });
    try {
      const response = await fetch(`/api/shopify/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carState),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Shopify product updated:', result);
        toast.success('Product updated successfully in Shopify!', {
          id: toastId,
        });

        // Update MongoDB
        await updateMongoDB(carState);

        // Optionally, redirect to the car listing page
        // location.href = '/dashboard/direct-sale';

      } else {
        console.error('Failed to update Shopify product');
        toast.error('Failed to update product in Shopify. Please try again.', {
          id: toastId,
        });
      }
    } catch (error) {
      console.error('Error updating Shopify product:', error);
      toast.error('An error occurred while updating the product. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateMongoDB = async (productData) => {
    try {
      const response = await fetch(`/api/dashboard/savelists/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        console.log('Product updated in MongoDB successfully');
      } else {
        console.error('Failed to update product in MongoDB');
      }
    } catch (error) {
      console.error('Error updating product in MongoDB:', error);
    }
  };

  if (isDataLoading) {
    return (
      <div className="max-w-4xl mx-auto p-10 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold mb-6"><Skeleton width={200} /></h1>
        <div className="w-3/4">
          <div className="mb-8">
            <h2 className="font-semibold text-sm mb-4"><Skeleton width={150} /></h2>
            <Skeleton height={200} />
          </div>
          <div className="mb-10">
            <Skeleton count={5} height={40} className="mb-4" />
          </div>
          <Skeleton count={3} height={50} className="mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white shadow rounded-lg">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Edit Car Information</h1>
      <div className="w-3/4">
        <div className="mb-8">
          <h2 className="font-semibold text-sm mb-4">Vehicle Images</h2>
          <MultiImageUpload onImageUpload={handleImageUpload} initialImages={carState.imagesbase} />
        </div>

        <div className="mb-10">
          <label className="block text-sm mb-2 font-semibold">Sell Price *</label>
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
          showMoreDetails={true}
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
          onClick={updateShopifyProduct}
        >
          {isLoading ? (
            <>
              <span className="ml-2">Updating...</span>
            </>
          ) : (
            'Update'
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