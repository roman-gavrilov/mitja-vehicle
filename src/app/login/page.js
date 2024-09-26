// File: app/login/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Hello! Welcome!</h1>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit}>
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
              className="w-full p-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <div className="text-right mt-2">
              <a href="/forgot-password" className="text-orange-500 text-sm">Forgotten your password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-orange-600 transition"
            >
              Login
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm">
            Sign up? <a href="/signup" className="text-orange-500">Go to Sign Up</a>
          </p>
        </div>
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
