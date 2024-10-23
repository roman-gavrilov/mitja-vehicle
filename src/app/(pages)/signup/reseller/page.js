"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from 'next/image';
import Link from 'next/link';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export default function ResellerSignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [logo, setLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const validatePhoneNumber = (phoneNumber) => {
    try {
      const parsedNumber = parsePhoneNumber(phoneNumber);
      if (!parsedNumber) {
        setPhoneError("Invalid phone number");
        return false;
      }
      if (!isValidPhoneNumber(phoneNumber)) {
        setPhoneError("Invalid phone number");
        return false;
      }
      setPhoneError("");
      return true;
    } catch (error) {
      setPhoneError("Invalid phone number");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const notification = toast.loading(
      `Creating a reseller account...`
    );

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("companyName", companyName);
    formData.append("street", street);
    formData.append("zip", zip);
    formData.append("city", city);
    formData.append("vatNumber", vatNumber);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const res = await fetch("/api/auth/reseller-signup", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(
          "Reseller account created successfully!",
          {
            duration: 3000,
            id: notification,
          }
        );
        router.push(`/dashboard/reseller-profile`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "An error occurred during signup.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        id: notification,
      });
    }
  };

  const handleLogoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
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
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="text-left mb-8">
          <Image src="/images/logo.png" alt="Sitemark" width={30} height={27} layout='fixed'/>
          <h1 className="text-4xl font-semibold mt-6 mb-2">Reseller Sign up</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
              <input
                id="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP</label>
              <input
                id="zip"
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">VAT Number</label>
              <input
                id="vatNumber"
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <PhoneInput
              containerStyle={{ width: '100%' }} 
              defaultCountry="us"
              value={phone}
              onChange={(phone) => {
                setPhone(phone);
                validatePhoneNumber(phone);
              }}
              inputStyle={{ width: '100%' }}
              required
            />
            {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="mb-4">
                    <img src={previewUrl} alt="Logo preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="logo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleLogoChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <input type="checkbox" id="consent" className="mr-2" required />
            <label htmlFor="consent" className="text-sm">
              I agree to the use of my data to receive personalised email
              advertising from mobile.de (including email analysis), as
              described in more detail in the
              <a
                href="/declaration-of-consent"
                className="text-blue-600 ml-1"
              >
                Declaration of Consent
              </a>
              . I may revoke this consent at any time.
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register as Reseller
          </button>

          <Link href="/signup" className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 mt-4 text-sm rounded-lg hover:bg-gray-200 transition">
            Back to Regular Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
}