"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from 'next/image';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export default function ProfileForm({ initialData }) {
  const [formData, setFormData] = useState(initialData);
  const [previewUrl, setPreviewUrl] = useState(initialData.companyDetails?.logo || null);
  const [phoneError, setPhoneError] = useState("");
  const fileInputRef = useRef(null);
  const router = useRouter();

  const validatePhoneNumber = (phoneNumber) => {
    try {
      const parsedNumber = parsePhoneNumber(phoneNumber);
      if (!parsedNumber || !isValidPhoneNumber(phoneNumber)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.companyDetails.phone)) {
      toast.error("Please enter a valid primary phone number");
      return;
    }

    // Validate additional phone numbers
    const invalidAdditionalPhones = formData.companyDetails.additionalPhones.filter(
      phone => phone && !validatePhoneNumber(phone)
    );
    if (invalidAdditionalPhones.length > 0) {
      toast.error("Please enter valid additional phone numbers");
      return;
    }

    const notification = toast.loading("Updating profile...");

    const submitData = new FormData();
    // Handle top-level properties
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('email', formData.email);

    // Handle nested companyDetails
    Object.entries(formData.companyDetails).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof File) {
        submitData.append(`companyDetails.${key}`, value);
      } else if (key === 'workingHours' || key === 'additionalPhones' || key === 'additionalEmails') {
        submitData.append(`companyDetails.${key}`, JSON.stringify(value));
      } else {
        submitData.append(`companyDetails.${key}`, value);
      }
    });

    try {
      const res = await fetch("/api/dashboard/profile/reseller", {
        method: "POST",
        body: submitData,
      });

      if (res.ok) {
        toast.success("Profile updated successfully!", {
          id: notification,
        });
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update profile", {
          id: notification,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An unexpected error occurred", {
        id: notification,
      });
    }
  };

  const handleLogoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          logo: file
        }
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          logo: file
        }
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleWorkingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        workingHours: {
          ...prev.companyDetails.workingHours,
          [day]: {
            ...prev.companyDetails.workingHours[day],
            [field]: field === 'isOpen' ? value : value,
          },
        },
      }
    }));
  };

  const addAdditionalField = (field) => {
    if (formData.companyDetails[field].length < 2) {
      setFormData(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          [field]: [...prev.companyDetails[field], ""]
        }
      }));
    } else {
      toast.error(`Maximum ${field === 'additionalEmails' ? 'email' : 'phone'} limit reached`);
    }
  };

  const removeAdditionalField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        [field]: prev.companyDetails[field].filter((_, i) => i !== index)
      }
    }));
  };

  const handleAdditionalFieldChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        [field]: prev.companyDetails[field].map((item, i) => i === index ? value : item)
      }
    }));
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col gap-6">
        {/* Logo at the top */}
        <div className="relative w-24 h-24 mx-auto">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Company Logo"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
              {formData.companyDetails?.companyName?.[0]?.toUpperCase() || "C"}
            </div>
          )}
          <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              className="hidden"
              onChange={handleLogoChange}
              accept="image/*"
              ref={fileInputRef}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Company Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={formData.companyDetails.companyName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyDetails: {
                  ...prev.companyDetails,
                  companyName: e.target.value
                }
              }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                value={formData.companyDetails.street}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyDetails: {
                    ...prev.companyDetails,
                    street: e.target.value
                  }
                }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP</label>
              <input
                type="text"
                value={formData.companyDetails.zip}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyDetails: {
                    ...prev.companyDetails,
                    zip: e.target.value
                  }
                }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={formData.companyDetails.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyDetails: {
                    ...prev.companyDetails,
                    city: e.target.value
                  }
                }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">VAT Number</label>
              <input
                type="text"
                value={formData.companyDetails.vatNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyDetails: {
                    ...prev.companyDetails,
                    vatNumber: e.target.value
                  }
                }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-4 pb-5 pt-5 border-b border-t">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            
            {/* Primary Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Additional Emails */}
            <div className="flex flex-col gap-3 ml-5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Additional Emails</label>
                <button
                  type="button"
                  onClick={() => addAdditionalField('additionalEmails')}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {formData.companyDetails.additionalEmails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleAdditionalFieldChange(index, e.target.value, 'additionalEmails')}
                    placeholder={`Additional Email ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalField('additionalEmails', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Primary Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Phone</label>
              <PhoneInput
                containerStyle={{ width: '100%' }}
                defaultCountry="us"
                value={formData.companyDetails.phone}
                onChange={(phone) => setFormData(prev => ({
                  ...prev,
                  companyDetails: {
                    ...prev.companyDetails,
                    phone
                  }
                }))}
                inputStyle={{ width: '100%' }}
                required
              />
            </div>

            {/* Additional Phones */}
            <div className="flex flex-col gap-3 ml-5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Additional Phones</label>
                <button
                  type="button"
                  onClick={() => addAdditionalField('additionalPhones')}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {formData.companyDetails.additionalPhones.map((phone, index) => (
                <div key={index} className="relative">
                  <PhoneInput
                    containerStyle={{ width: '100%' }}
                    defaultCountry="us"
                    value={phone}
                    onChange={(phone) => handleAdditionalFieldChange(index, phone, 'additionalPhones')}
                    inputStyle={{ width: '86%' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalField('additionalPhones', index)}
                    className="p-2 text-red-600 hover:text-red-800 absolute right-0 top-0"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex flex-col gap-4 pb-5 border-b">
            <h2 className="text-xl font-semibold">Working Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.companyDetails.workingHours).map(([day, hours]) => (
                <div 
                  key={day}
                  className={`flex flex-col p-4 rounded-lg transition-all duration-200 ${
                    hours.isOpen 
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium capitalize text-gray-900">{day}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={(e) => handleWorkingHoursChange(day, 'isOpen', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {hours.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </label>
                  </div>
                  <div className={`flex flex-col sm:flex-row gap-3 transition-opacity duration-200 ${
                    hours.isOpen ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Opens at</label>
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                        disabled={!hours.isOpen}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Closes at</label>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                        disabled={!hours.isOpen}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}