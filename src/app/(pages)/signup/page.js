// File: app/signup/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard`);
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "An error occurred during signup.");
    }
  };

  const handleGoogleSignup = async (tokenResponse) => {
    const userInfo = await axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      })
      .then(res => res.data);

    try {
      const res = await fetch("/api/auth/google-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (res.ok) {
        router.push(`/dashboard`);
      } else {
        const errorData = await res.json();
        toast.error(
          errorData.error || "An error occurred during Google signup."
        );
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("An error occurred during Google signup.");
    }
  };

  const signup = useGoogleLogin({
    onSuccess: handleGoogleSignup
  });


  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 md:p-0 p-3">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="text-left mb-8">
          <Image src="/images/logo.png" alt="Sitemark" width={30} height={27} layout='fixed'/>
          <h1 className="text-4xl font-semibold mt-6 mb-2">Sign up</h1>
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
          <span className="text-sm mt-[2px] ml-[5px] font-medium">Register with Google</span>
        </button>

        <div className="flex items-center w-full max-w-sm my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm font-medium text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
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
            Register
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 mt-4 text-sm rounded-lg hover:bg-gray-200 transition"
          >
            Back
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Are you a reseller?{" "}
              <Link href="/signup/reseller" className="text-blue-600 hover:underline">
                Sign up as a reseller
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
