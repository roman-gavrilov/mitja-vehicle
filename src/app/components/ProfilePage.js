"use client"

import React, { useState } from 'react';

export default function AccountSettings() {
  const [email, setEmail] = useState("roman.gavrilov.0309@gmail.com");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const handleEmailChange = () => {
    setIsEditingEmail(true);
  };

  const handleSaveEmail = (newEmail) => {
    setEmail(newEmail);
    setIsEditingEmail(false);
  };

  const handleResetPassword = () => {
    console.log("Reset password clicked");
    // Implement the logic to reset the password, maybe redirect to another page
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Your account settings</h1>
      <p className="text-sm text-gray-600 mb-6">Your customer number: 36321331</p>

      {/* Profile Section */}
      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center">
            <img src="/images/profile-placeholder.png" alt="Profile" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="text-sm text-gray-600">Profile picture</p>
              <p className="text-xs text-gray-400">(Only visible for you)</p>
            </div>
          </div>
          <button className="text-blue-600 font-semibold">Change</button>
        </div>
      </div> */}

      {/* Login Data Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Login data</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-700">E-mail Address</p>
              {!isEditingEmail ? (
                <>
                  <p className="text-sm text-gray-700">{email}</p>
                  <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 mt-2 rounded-full">Confirmed</span>
                </>
              ) : (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                />
              )}
            </div>
            {!isEditingEmail ? (
              <button onClick={handleEmailChange} className="text-blue-600 font-semibold">Change</button>
            ) : (
              <button onClick={() => handleSaveEmail(email)} className="text-blue-600 font-semibold">Save</button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <p className="font-bold text-gray-700">Password</p>
          <button onClick={handleResetPassword} className="text-blue-600 font-semibold">Reset</button>
        </div>
      </div>

      {/* Contact Data Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Contact data</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center justify-between">
          <p className="font-bold text-gray-700">Name</p>
          <button className="text-blue-600 font-semibold">Change</button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center justify-between">
          <p className="font-bold text-gray-700">Address</p>
          <button className="text-blue-600 font-semibold">Add</button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
          <p className="font-bold text-gray-700">Phone number</p>
          <button className="text-blue-600 font-semibold">Add</button>
        </div>
      </div>
    </div>
  );
}
