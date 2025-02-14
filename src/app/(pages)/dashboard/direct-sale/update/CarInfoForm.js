"use client";
import React, { useState, useEffect } from "react";
import { toast, Toaster } from 'react-hot-toast';
import { Circles } from 'react-loader-spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  carMakes,
} from "@/app/components/ads/carData";
import PopularBrands from "../save/car/PopularBrands";
import { GreenCheckMark } from "../save/CustomComponents";
import { VehicleDetails } from "../save/car/FormSections";
import ImageGallery from "react-image-gallery";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RichTextEditor from "@/app/components/RichTextEditor";

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
    bodyColor: "#ffffff",
    interiorColor: "#000000",
    engineDisplacement: "2.0",
    bodyType: "Sedan",
    description: "",
    numberOfOwners: "",
    condition: "",
    features: {
      alarmSystem: true,
      ambientLighting: true,
      androidAuto: true,
      appleCarPlay: true,
      armRest: true,
      automDimmingInteriorMirror: true,
      auxiliaryHeating: true,
      bluetooth: true,
      cargoBarrier: true,
      cdPlayer: true,
      dabRadio: true,
      digitalCockpit: true,
      disabledAccessible: true,
      electricBackseatAdjustment: true,
      electricSeatAdjustment: true,
      electricSeatAdjustmentWithMemoryFunction: true,
      electricSideMirror: true,
      electricWindows: true,
      emergencyCallSystem: true,
      fatigueWarningSystem: true,
      foldFlatPassengerSeat: true,
      foldingExteriorMirrors: true,
      handsFreeKit: true,
      headUpDisplay: true,
      heatedRearSeats: true,
      heatedSeats: true,
      heatedSteeringWheel: true,
      inductionChargingForSmartphones: true,
      integratedMusicStreaming: true,
      isofix: true,
      leatherSteeringWheel: true,
      lumbarSupport: true,
      massageSeats: true,
      multifunctionSteeringWheel: true,
      navigationSystem: true,
      onBoardComputer: true,
      paddleShifters: true,
      passengerSeatIsofixPoint: true,
      seatVentilation: true,
      showRightHandDrive: true,
      skiBag: true,
      smokersPackage: true,
      soundSystem: true,
      sportSeats: true,
      touchscreen: true,
      tunerRadio: true,
      tv: true,
      usbPort: true,
      virtualSideMirrors: true,
      voiceControl: true,
      winterPackage: true,
      wlanWifiHotspot: true,
      abs: true,
      adaptiveCorneringLights: true,
      adaptiveLighting: true,
      airSuspension: true,
      allSeasonTyres: true,
      alloyWheels: true,
      biXenonHeadlights: true,
      blindSpotAssist: true,
      centralLocking: true,
      daytimeRunningLights: true,
      distanceWarningSystem: true,
      dynamicChassisControl: true,
      electricTailgate: true,
      emergencyBrakeAssist: true,
      emergencyTyre: true,
      emergencyTyreRepairKit: true,
      esp: true,
      fogLamps: true,
      foldingRoof: true,
      fourWheelDrive: true,
      glareFreeHighBeamHeadlights: true,
      headlightWasherSystem: true,
      heatedWindshield: true,
      highBeamAssist: true,
      hillStartAssist: true,
      immobilizer: true,
      keylessCentralLocking: true,
      laneChangeAssist: true,
      laserHeadlights: true,
      ledHeadlights: true,
      ledRunningLights: true,
      lightSensor: true,
      nightVisionAssist: true,
      panoramicRoof: true,
      powerAssistedSteering: true,
      rainSensor: true,
      roofRack: true,
      spareTyre: true,
      speedLimitControlSystem: true,
      sportsPackage: true,
      sportsSuspension: true,
      startStopSystem: true,
      steelWheels: true,
      summerTyres: true,
      sunroof: true,
      tintedWindows: true,
      tractionControl: true,
      trafficSignRecognition: true,
      tyrePressureMonitoring: true,
      winterTyres: true,
      xenonHeadlight: true
    }    
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});
  const [openMediaGallery, setOpenMediaGallery] = useState(false);

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
    // Clear the invalid field status when the user makes a change
    setInvalidFields((prevInvalidFields) => ({
      ...prevInvalidFields,
      brand: false,
      model: false,
      doors: false,
      fuelType: false,
      power: false,
    }));
  };

  const handleInputChange = (field, value) => {
    setCarState(prevState => ({
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
      bodyType,
      engineDisplacement,
      numberOfOwners,
      condition,
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
      bodyType &&
      engineDisplacement&&
      numberOfOwners &&
      condition
    );
  };

  const highlightInvalidFields = () => {
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
      bodyType,
      engineDisplacement,
      numberOfOwners,
      condition,
    } = carState;
    
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
      bodyType: !bodyType,
      engineDisplacement: !engineDisplacement,
      numberOfOwners: !numberOfOwners,
      condition: !condition,
    });
  };

  const updateShopifyProduct = async () => {
    if (!isFormValid()) {
      highlightInvalidFields();
      toast.error('Please fill in all required fields.');
      return;
    }

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

  const handleOpenMediaGallery = () => {
    setOpenMediaGallery(true);
  };

  const handleCloseMediaGallery = () => {
    setOpenMediaGallery(false);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAddImage = () => {
    // Implement image adding functionality here
    console.log("Add image functionality to be implemented");
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
      <h3 className="font-bold uppercase md:text-lg text-base">Update Vehicle</h3>
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
    <div>
      <Toaster />
      <div className="w-full justify-between gap flex gap-10 flex-wrap md:flex-nowrap">
        <div className="lg:w-1/3  w-full">
          <div className="md:sticky relative top-4 ">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Media Gallery</h4>
                <Button variant="outlined" onClick={handleOpenMediaGallery}>
                  Update
                </Button>
              </div>
              <ImageGallery items={images} />
            </div>
            <div className="mb-4 mt-5 bg-white shadow rounded-lg p-4">
              <label className="block mb-2 font-bold">Description</label>
              <RichTextEditor
                value={carState.description}
                onEditorChange={(content) => handleInputChange("description", content)}
              />
            </div>
          </div>
        </div>
        <div className="lg:w-2/3 p-4 w-full bg-white shadow rounded-lg">
          <div className="mb-10 mr-[40px]">
            <label className={`block text-sm mb-2 font-semibold ${invalidFields.price ? 'text-red-500' : ''}`}>
              Sell Price *
            </label>
            <div className={`flex items-center border rounded-md p-1 pr-[10px] bg-white relative ${invalidFields.price ? 'border-red-500' : ''}`}>
              <input
                type="number"
                className={`border-none flex-1 p-2 focus:outline-none ${invalidFields.price ? 'text-red-500' : ''}`}
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
            {invalidFields.price && <p className="text-red-500 text-sm mt-1">This field is required</p>}
          </div>

          <PopularBrands handleBrandClick={handleBrandClick} selectedBrand={carState.brand} />
          <VehicleDetails
            carState={carState}
            handleInputChange={handleInputChange}
            showMoreDetails={true}
            handleFeatureToggle={handleFeatureToggle}
            invalidFields={invalidFields}
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

      <Dialog
        open={openMediaGallery}
        onClose={handleCloseMediaGallery}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.original} alt={`Car image ${index + 1}`} className="w-full h-auto" />
                <IconButton
                  className="absolute top-2 right-2 bg-white"
                  onClick={() => handleRemoveImage(index)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ))}
            <div 
              className="flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer"
              onClick={handleAddImage}
            >
              <AddIcon className="text-gray-400" style={{ fontSize: 48 }} />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMediaGallery} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
}