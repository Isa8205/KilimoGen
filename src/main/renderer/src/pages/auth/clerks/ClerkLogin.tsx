import axios from 'axios';
import { ArrowLeft, Home, EyeIcon, EyeOff } from 'lucide-react';
import { Suspense, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import notify from '@/utils/ToastHelper';
import { useRecoilState } from 'recoil';
import { sessionState } from '@/store/store';

export default function ClerkLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null)!;
  const setUser = useRecoilState(sessionState)[1];
  
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home/dashboard';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData as any);

    const res = await window.electron.invoke('user-login', data)
    notify(res.passed, res.message)
    if (res.user) {
      setUser(res.user)
      setTimeout(() => {
        navigate(from)
      }, 2000);
    }
  };

  return (
    <Suspense>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <ToastContainer />

      {/* Top Navigation Buttons */}
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 hover:opacity-80 p-2 rounded-lg transition border border-orange-200 bg-orange-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={() => navigate('/home/dashboard')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 p-2 rounded-lg transition border border-orange-200 bg-orange-100"
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      {/* Login Form */}
      <div className="p-8 rounded-lg shadow-xl w-full max-w-md bg-white">
        <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="flex flex-col gap-4"
        >
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-800"
            >
              Username or email
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="eg. John Doe"
              className="mt-1 block w-full bg-gray-100 border p-2 rounded-md text-gray-900"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1 block w-full bg-gray-100 border p-2 rounded-md text-gray-900 pr-10"
              />
              {showPassword ? (
                <button
                  type="button"
                  className="absolute right-3 top-3 cursor-pointer text-gray-700 hover:text-orange-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <EyeOff />
                </button>
              ) : (
                <button
                  type="button"
                  className="absolute right-3 top-3 cursor-pointer text-gray-700 hover:text-orange-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon />
                </button>
              )}
            </div>
          </div>

          {/* Forgot password field */}
          <div className="text-end text-sm m-0 text-orange-500 hover:text-orange-600 cursor-pointer">
            Forgot Password ?
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </Suspense>
  );
}
