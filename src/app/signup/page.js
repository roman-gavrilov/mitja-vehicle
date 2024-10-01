// File: app/signup/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard`);
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || 'An error occurred during signup.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Create your account!</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <input
            type="email"
            placeholder="E-Mail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <div className="mt-4">
            <input type="checkbox" id="consent" className="mr-2" required />
            <label htmlFor="consent">
              I agree to the use of my data to receive personalised email advertising from mobile.de (including email analysis), as described in more detail in the 
              <a href="/declaration-of-consent" className="text-orange-500 ml-1">Declaration of Consent</a>. I may revoke this consent at any time.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-orange-600 transition"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 mt-4 rounded-lg hover:bg-gray-200 transition"
          >
            Back
          </button>
        </form>
      </div>

      <div className="hidden lg:block bg-white shadow-md rounded-lg p-8 ml-10 w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-4">Your advantages with a xxx account</h2>
        <ul className="space-y-2 text-gray-600">
          <li>✔ Parked vehicles available everywhere</li>
          <li>✔ Save searches</li>
          <li>✔ Always get the latest deals</li>
        </ul>
      </div>
    </div>
  );
}
