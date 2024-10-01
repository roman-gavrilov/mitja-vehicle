import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Circles } from "react-loader-spinner";

const MultiImageUpload = ({ onImageUpload }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
    uploadImages(files);
  };

  const uploadImages = async (files) => {
    console.log(files);
    setUploading(true);
    const uploadToastId = toast.loading(
      `Uploading ${files.length} image(s)...`
    );

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success(
          "Image uploaded and start analyz the image successfully!",
          {
            duration: 3000,
            id: uploadToastId, // Update the loading toast to success
          }
        );

        const { uploadedFiles: data } = await response.json();
        const gptAIBody = [
          {
            type: "text",
            text: "in json format, json key should be vehicle and values are brand, model, mileage, doors, fuel type, power. if unknow values, don't show and don't need include km, HP too",
          },
        ];

        data.forEach((v) => {
          gptAIBody.push({
            type: "image_url",
            image_url: {
              url: v.base64ImageString,
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
          images: data.map(d => d.imageUrl),
          base64Images: data.map(d=> d.base64Image),
          aiResult: JSON.parse(chatGPTresult.result)
        })
      } else {
        throw new Error("Image upload failed");
      }
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
    <div className="relative flex flex-col items-center">
      <Toaster />

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

      <div className="grid grid-cols-3 gap-4 w-full">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.preview}
              alt={`Vehicle ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
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
