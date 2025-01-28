import axios from 'axios';
import { ArrowLeft, Home } from 'lucide-react';
import { EyeIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgrounds/ForestLake.png';
import { ToastContainer } from 'react-toastify';
import notify from '@/components/Widgets/ToastHelper';

export default function ClerkLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null)!;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.table(data);

    await axios
      .post('http://localhost:3000/api/clerk/login', data)
      .then((res) => {
        console.log(res.data);
        notify(res.data.passed, res.data.message);

        if (res.data.passed) {
          setTimeout(() => {
            // window.location.href = '/home/dashboard';
          }, 2000);
        }
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <ToastContainer />
      {/* Top Navigation Buttons */}
      <div className="absolute top-4 left-4 flex items-center gap-4 backdrop:blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 hover:opacity-80 p-2 rounded-lg transition"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            // border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={() => navigate('/home/dashboard')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 p-2 rounded-lg transition"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            // border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      {/* Glass Effect Center Div */}
      <div
        className="p-8 rounded-lg shadow-xl w-full max-w-md"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="flex flex-col gap-6"
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
              className="mt-1 block w-full bg-transparent border-b border-gray-300 focus:border-orange-500 focus:ring-0 p-2 text-gray-8000"
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
                placeholder="&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;"
                className="mt-1 block w-full bg-transparent border-b border-gray-300 focus:border-orange-500 focus-visible:outline-none p-2 text-gray-800"
              />
              <EyeIcon
                className="absolute right-3 top-3 cursor-pointer text-gray-700 hover:text-orange-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-orange-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Login
          </button>

          {/* Divider for Alternative Actions */}
          <div className="text-center text-sm text-gray-800 mt-4">
            Don't have an account?{' '}
            <a
              href="/auth/clerk/register"
              className="text-orange-600 hover:underline"
            >
              Sign up here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
