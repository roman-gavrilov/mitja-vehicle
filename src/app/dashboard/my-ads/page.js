'use client';
import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

export default function MyAds() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">My Ads</h1>
      <h2 className="text-xl font-semibold mb-4">Create new ad</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
        <PlusCircleIcon className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg mb-2">Do you have any treasures in your garage?</p>
        <p className="text-sm text-gray-600 mb-4">
          Whether you want to run a Direct Sale for the quickest sale or an ad for the best price, we offer you the right option for selling your vehicle!
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Sell your car for free
        </button>
      </div>
    </>
  );
}