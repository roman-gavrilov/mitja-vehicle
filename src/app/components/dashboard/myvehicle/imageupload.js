import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Circles } from 'react-loader-spinner'; // Import the spinner

const ImageUpload = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setUploading(true); // Show the spinner
    const formData = new FormData();
    formData.append('image', file);

    // Display the uploading notification
    const uploadToastId = toast.loading('Uploading image...');

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        toast.success('Image uploaded and start analyz the image successfully!', {
          duration: 3000,
          id: uploadToastId,  // Update the loading toast to success
        });

        const resVehicleAI = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{
            "type": "image_url",
            "image_url": {
              "url": data.base64ImageString
            }
          },
          {
            "type": "text",
            "text": "provide me vehicle color, make, model, doors, fuel from image. just provide me it as json format. just give me json, not your description"
          }]),
        });

        const chatGPTresult = await resVehicleAI.json();

        onImageUpload(data.imageUrl, chatGPTresult);

      } else {
        console.error('Image upload failed');

        // Display error notification
        toast.error('Image upload failed', {
          id: uploadToastId,  // Update the loading toast to error
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);

      // Display error notification
      toast.error('Error uploading image', {
        id: uploadToastId,  // Update the loading toast to error
      });
    } finally {
      setUploading(false); // Hide the spinner
    }
  };

  const handleClick = () => {
    document.getElementById('upload').click();
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Toaster for showing notifications */}
      <Toaster />

      {/* Input for selecting an image */}
      <input
        type="file"
        id="upload"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      
      {/* Placeholder for the image */}
      <div
        className="w-[100%] h-48 border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer rounded-lg hover:border-gray-600 mb-4"
        onClick={handleClick}
      >
        {image ? (
          <img src={image} alt="Vehicle" className="max-w-full max-h-full object-cover rounded-lg" />
        ) : (
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
            <p className="text-gray-500 mt-2">Vehicle Image</p>
          </div>
        )}
      </div>

      {/* Full-screen loader with overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center">
          <Circles
            height="100"
            width="100"
            color="#ffffff"  // White spinner to contrast against dark background
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
