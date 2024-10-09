"use client";
import React, { useState, useEffect } from "react";
import { toast, Toaster } from 'react-hot-toast';
import { Circles } from 'react-loader-spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  carMakes,
} from "@/app/components/ads/carData";
import PopularBrands from "../save/PopularBrands";
import { GreenCheckMark } from "../save/CustomComponents";
import { VehicleDetails } from "../save/FormSections";
import ImageGallery from "react-image-gallery";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function CarInfoForm({ carId }) {
  const [images, setImages] = useState([]);
  const [oldcarState, setOldcarState] = useState(null);
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
    price: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchCarData();
    fetchUserData();
  }, [carId]);

  const compareTwoObjects = (obj1, obj2) => {
    // Check if both are objects
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      // If both are null or undefined, return true
      if (obj1 === null || obj2 === null) {
        return obj1 === obj2;
      }

      // If they are arrays, compare length and recursively check elements
      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
          if (!compareTwoObjects(obj1[i], obj2[i])) return false;
        }
        return true;
      }

      // If they are both objects, compare keys and recursively check properties
      if (!Array.isArray(obj1) && !Array.isArray(obj2)) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Check if the number of keys is the same
        if (keys1.length !== keys2.length) return false;

        // Check if all keys exist in both objects and their values are equal
        for (const key of keys1) {
          if (!compareTwoObjects(obj1[key], obj2[key])) return false;
        }
        return true;
      }
      
      // If one is an array and the other is not, return false
      return false;
    }

    // If both are not objects, compare primitive values (string, number, boolean, etc.)
    return obj1 === obj2;
  }

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
        setOldcarState(carData);
        setImages(carData.shopifyproduct.images.map(image => {
          return {
            original: image.src,
            thumbnail: image.src,
          };
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
      const response = await fetch(`/api/shopify?productid=${carState.shopifyproduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carState),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Shopify product updated:', result);
        // Update MongoDB
        await updateMongoDB({
          ...carState,
          shopifyproduct: result.product, // Assuming the Shopify API returns the product ID
        });

        toast.success('Product updated successfully!', {
          id: toastId,
        });

        // Optionally, redirect to the car listing page
        location.href = '/dashboard/direct-sale';

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
        const result = await response.json();
        console.log('Product updated in MongoDB successfully:', result);
        toast.success('Vehicle information updated successfully!');
      } else {
        console.error('Failed to update product in MongoDB');
        toast.error('Failed to update vehicle information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product in MongoDB:', error);
      toast.error('An error occurred while updating the vehicle information. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Deleting Product...', {
      position: 'top-center',
    });
    try {
      const response = await fetch(`/api/dashboard/savelists/${carId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Product deleted successfully!', {
          id: toastId,
        });
        // Redirect to the car listing page
        location.href = '/dashboard/direct-sale';
      } else {
        console.error('Failed to delete product');
        toast.error('Failed to delete product. Please try again.', {
          id: toastId,
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  if (isDataLoading) {
    return (
      <div className="max-w-4xl mx-auto p-10 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold mb-6"><Skeleton width={200} /></h1>
        <div className="w-full">
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
    <>
    <div className="mb-[20px] items-center justify-between flex">
      <h3 className="font-bold uppercase text-lg">Update Vehicle</h3>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="contained"
          disabled={!isFormValid() || isLoading || compareTwoObjects(carState, oldcarState)}
          onClick={updateShopifyProduct}
        >
          {isLoading ? (
            <>
              <span className="ml-2">Updating...</span>
            </>
          ) : (
            'Update'
          )}
        </Button>
        <Button variant="contained" color="error" onClick={handleOpenDeleteDialog}>
          Delete
        </Button>
      </Stack>
    </div>
    <div className="p-10 bg-white shadow rounded-lg">
      <Toaster />
      {/* <h1 className="text-3xl font-bold mb-6">Edit Car Information</h1> */}
      <div className="w-full flex flex-wrap">
        <div className="lg:w-1/2 p-4 w-full">
          <div className="mb-8">
            <ImageGallery items={images} />
          </div>
        </div>
        <div className="lg:w-1/2 p-4 w-full">
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

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this vehicle? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
}