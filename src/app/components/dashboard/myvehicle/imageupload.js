import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

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
    setUploading(true);
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
        onImageUpload(data.imageUrl);
        // Display success notification
        toast.success('Image uploaded successfully!', {
          id: uploadToastId,  // Update the loading toast to success
        });
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
      setUploading(false);
    }
  };

  const handleClick = () => {
    document.getElementById('upload').click();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Toaster for showing notifications */}
      <Toaster />

      <input
        type="file"
        id="upload"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
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
      {uploading && <p className="text-blue-500">Uploading image...</p>}
    </div>
  );
};

export default ImageUpload;
