import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import ImageGallery from "react-image-gallery";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.7;

const MultiImageUpload = ({ onImageUpload, vehicleType = 'car' }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: MIME_TYPE }));
          },
          MIME_TYPE,
          QUALITY
        );
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
    uploadImages(files);
  };

  const getGptAIBody = (type) => {
    if (type === 'motorcycle') {
      return [
        {
          type: "text",
          text: `"Analyze the motorcycle images and extract the following details as JSON without any descriptions. Follow the json format and fields. Color should be hex format. Don't include any units:
          {
              brand: "(value should be capitalize)",
              model: "",
              year: "",
              month: "",
              mileage: "",
              engineType: "",
              transmissionType: "",
              power: "",
              powerUnit: "kW/hp",
              price: "",
              bodyColor: "",
              engineDisplacement: "",
              motorcycleType: "",
              features: {
                ABS: (true/false),
                AlarmSystem: (true/false),
                CruiseControl: (true/false),
                ElectricStart: (true/false),
                HeatedGrips: (true/false),
                LEDLights: (true/false),
                QuickShifter: (true/false),
                RidingModes: (true/false),
                TractionControl: (true/false),
                TubelessTires: (true/false),
                UsbCharging: (true/false),
                WindScreen: (true/false)
              },
            }`
        }
      ];
    }
    
    return [
      {
        type: "text",
        text: `"Analyze the car images and extract the following details as JSON without any descriptions. Follow the json format and fields. Color should be hex format. Don't include any units like km,kw etc...:
        {
            brand: "(value should be capitalize)",
            model: "",
            year: "",
            month: "",
            mileage: "",
            doors: "",
            transmissiontype: (manual/automatic),
            fuelType: "",
            power: "",
            powerUnit: "kW/hp",
            price: "",
            bodyColor: "",
            interiorColor: "",
            engineDisplacement: "",
            bodyType: "",
            features: {
              alarmSystem: (true/false),
              ambientLighting: (true/false),
              androidAuto: (true/false),
              appleCarPlay: (true/false),
              armRest: (true/false),
              automDimmingInteriorMirror: (true/false),
              auxiliaryHeating: (true/false),
              bluetooth: (true/false),
              cargoBarrier: (true/false),
              cdPlayer: (true/false),
              dabRadio: (true/false),
              digitalCockpit: (true/false),
              disabledAccessible: (true/false),
              electricBackseatAdjustment: (true/false),
              electricSeatAdjustment: (true/false),
              electricSeatAdjustmentWithMemoryFunction: (true/false),
              electricSideMirror: (true/false),
              electricWindows: (true/false),
              emergencyCallSystem: (true/false),
              fatigueWarningSystem: (true/false),
              foldFlatPassengerSeat: (true/false),
              foldingExteriorMirrors: (true/false),
              handsFreeKit: (true/false),
              headUpDisplay: (true/false),
              heatedRearSeats: (true/false),
              heatedSeats: (true/false),
              heatedSteeringWheel: (true/false),
              inductionChargingForSmartphones: (true/false),
              integratedMusicStreaming: (true/false),
              isofix: (true/false),
              leatherSteeringWheel: (true/false),
              lumbarSupport: (true/false),
              massageSeats: (true/false),
              multifunctionSteeringWheel: (true/false),
              navigationSystem: (true/false),
              onBoardComputer: (true/false),
              paddleShifters: (true/false),
              passengerSeatIsofixPoint: (true/false),
              seatVentilation: (true/false),
              showRightHandDrive: (true/false),
              skiBag: (true/false),
              smokersPackage: (true/false),
              soundSystem: (true/false),
              sportSeats: (true/false),
              touchscreen: (true/false),
              tunerRadio: (true/false),
              tv: (true/false),
              usbPort: (true/false),
              virtualSideMirrors: (true/false),
              voiceControl: (true/false),
              winterPackage: (true/false),
              wlanWifiHotspot: (true/false),
              abs: (true/false),
              adaptiveCorneringLights: (true/false),
              adaptiveLighting: (true/false),
              airSuspension: (true/false),
              allSeasonTyres: (true/false),
              alloyWheels: (true/false),
              biXenonHeadlights: (true/false),
              blindSpotAssist: (true/false),
              centralLocking: (true/false),
              daytimeRunningLights: (true/false),
              distanceWarningSystem: (true/false),
              dynamicChassisControl: (true/false),
              electricTailgate: (true/false),
              emergencyBrakeAssist: (true/false),
              emergencyTyre: (true/false),
              emergencyTyreRepairKit: (true/false),
              esp: (true/false),
              fogLamps: (true/false),
              foldingRoof: (true/false),
              fourWheelDrive: (true/false),
              glareFreeHighBeamHeadlights: (true/false),
              headlightWasherSystem: (true/false),
              heatedWindshield: (true/false),
              highBeamAssist: (true/false),
              hillStartAssist: (true/false),
              immobilizer: (true/false),
              keylessCentralLocking: (true/false),
              laneChangeAssist: (true/false),
              laserHeadlights: (true/false),
              ledHeadlights: (true/false),
              ledRunningLights: (true/false),
              lightSensor: (true/false),
              nightVisionAssist: (true/false),
              panoramicRoof: (true/false),
              powerAssistedSteering: (true/false),
              rainSensor: (true/false),
              roofRack: (true/false),
              spareTyre: (true/false),
              speedLimitControlSystem: (true/false),
              sportsPackage: (true/false),
              sportsSuspension: (true/false),
              startStopSystem: (true/false),
              steelWheels: (true/false),
              summerTyres: (true/false),
              sunroof: (true/false),
              tintedWindows: (true/false),
              tractionControl: (true/false),
              trafficSignRecognition: (true/false),
              tyrePressureMonitoring: (true/false),
              winterTyres: (true/false),
              xenonHeadlight: (true/false)
            },
          }`
      }
    ];
  };

  const uploadImages = async (files) => {
    setUploading(true);
    const uploadToastId = toast.loading(
      `Uploading ${files.length} image(s)...`
    );

    try {
      const resizedImages = [];

      for (const file of files) {
        const resizedFile = await resizeImage(file);
        const formData = new FormData();
        formData.append('file', resizedFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for file: ${file.name}`);
        }

        const { image } = await uploadResponse.json();
        resizedImages.push(image);
      }

      const gptAIBody = getGptAIBody(vehicleType);

      resizedImages.forEach((v) => {
        gptAIBody.push({
          type: "image_url",
          image_url: {
            url: v,
          },
        });
      });

      const resVehicleAI = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gptAIBody),
      });

      const chatGPTresult = await resVehicleAI.json();

      onImageUpload({
        images: [],
        base64Images: resizedImages.map(d => d.split(',')[1]),
        aiResult: JSON.parse(chatGPTresult.result)
      });

      toast.success(
        "Images uploaded and analyzed successfully!",
        {
          duration: 3000,
          id: uploadToastId,
        }
      );
    
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images", {
        id: uploadToastId,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    document.getElementById("upload").click();
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="relative flex flex-col items-center p-0 md:p-4">
      <Toaster />
      <h2 className="font-semibold text-sm mb-4">
        Upload Vehicle Images *
      </h2>
      <div className="w-full mb-5">
        {images.length > 0 &&
          <ImageGallery items={images.map(image => ({
            original: image.preview,
            thumbnail: image.preview,
          }))}/>
        }
      </div>

      <input
        type="file"
        id="upload"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        multiple
      />

      <div
        className="w-full h-48 border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer rounded-lg hover:border-gray-600 mb-4"
        onClick={handleClick}
      >
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10 mx-auto text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M7.5 12l4.5 4.5 4.5-4.5M12 15V3"
            />
          </svg>
          <p className="text-gray-500 mt-2">Click to upload vehicle images</p>
        </div>
      </div>

      {uploading && (
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
};

export default MultiImageUpload;
