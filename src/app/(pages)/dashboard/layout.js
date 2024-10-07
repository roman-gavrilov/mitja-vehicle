'use client';

import { createClient, repositoryName } from "@/prismicio";
import { PrismicNextLink, PrismicPreview } from "@prismicio/next";
import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/dashboard/sidebar';

export default function DashboardLayout({ children }) {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setFullName(data.fullName);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error (e.g., redirect to login page)
      }
    }

    fetchUserData();
  }, []);

  return (
    <div className="flex bg-gray-100">
      <Sidebar fullname={fullName} />
      <main className="flex-1 min-h-screen overflow-y-auto p-6">
        <div className="container max-w-[800px] mx-auto text-mainText">
          {children}
          <PrismicPreview repositoryName={repositoryName} />
        </div>
      </main>
    </div>
  );
}