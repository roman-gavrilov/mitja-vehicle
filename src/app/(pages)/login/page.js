// File: app/login/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';

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

  const handleGoogleSignup = async (tokenResponse) => {

    const {email, email:password} = await axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      })
      .then(res => res.data);

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

  const signup = useGoogleLogin({
    onSuccess: handleGoogleSignup
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Hello! Welcome!</h1>
        </div>

        <button onClick={() => signup()} className="flex items-center justify-center w-full max-w-sm p-3 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-150">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.36 10C22.49 10.72 22.56 11.47 22.56 12.25C22.56 15.6 21.36 18.42 19.28 20.34L15.7101 17.5701C15.7101 17.5701 15.71 17.5701 15.7101 17.5701C16.8801 16.7901 17.66 15.63 17.92 14.26H12V10H22.36Z"
              fill="#4285F4"
            ></path>
            <path
              d="M2.18005 16.9298L5.03 14.7098L5.82658 14.1001H5.84005C6.71005 16.7001 9.14005 18.6301 12.0001 18.6301C13.4801 18.6301 14.7301 18.2301 15.7101 17.5701L19.2801 20.3401C17.4601 22.0201 14.9701 23.0001 12.0001 23.0001C7.70005 23.0001 3.99005 20.5301 2.18005 16.9401V16.9298Z"
              fill="#34A853"
            ></path>
            <path
              d="M12.0001 5.38C13.6201 5.38 15.0601 5.94 16.2101 7.02L19.3601 3.87C17.4501 2.09 14.9701 1 12.0001 1C7.70005 1 3.99005 3.47 2.18005 7.07L5.84005 9.91C6.71005 7.31 9.14005 5.38 12.0001 5.38Z"
              fill="#EA4335"
            ></path>
            <path
              d="M2.18014 7.06984C2.18017 7.06978 2.18011 7.0699 2.18014 7.06984L5.83996 9.90995C5.61999 10.5699 5.49 11.2699 5.49 11.9998C5.49 12.7298 5.62 13.4298 5.84 14.0898L5.03 14.7098L2.18 16.9298C1.43 15.4498 1 13.7798 1 11.9998C1 10.2198 1.43014 8.54984 2.18014 7.06984Z"
              fill="#FBBC05"
            ></path>
          </svg>
          <span className="text-sm mt-[2px] ml-[5px]  font-medium">Login with Google</span>
        </button>

        <div className="flex items-center w-full max-w-sm my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm font-medium text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
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
