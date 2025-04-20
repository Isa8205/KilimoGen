import { ArrowLeft, EyeIcon, EyeOff, Home, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultImage from "@/assets/images/defaultUser.png";
import notify from "@/utils/ToastHelper";
import { ToastContainer } from "react-toastify";

export default function ClerkRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);
    const data = Object.fromEntries(formdata);

    const file = data.avatar;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const imageData = new Uint8Array(arrayBuffer);
      data["avatar"] = {
        type: file.type,
        name: file.name,
        data: imageData,
      };
    }

    console.log(data, file);

    setIsSubmitting(true);

    const res = await window.electron.invoke("add-clerk", data);
    console.log(res);

    if (res) {
      notify(res.passed, res.message);
      setIsSubmitting(false);
    }
  };

  // Handle Profile Image Upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <ToastContainer />
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 hover:opacity-80 p-2 rounded-lg transition border border-orange-200 bg-orange-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={() => navigate("/home/dashboard")}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 p-2 rounded-lg transition border border-orange-200 bg-orange-100"
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md mt-6 bg-white border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Clerk Register
        </h1>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Profile Image */}
          <div className="flex justify-center h-[100px] mb-4">
            <div className="relative">
              <img
                id="profileDisplay"
                src={profileImage || defaultImage}
                alt="Profile"
                className="h-full w-[100px] object-cover rounded-full border border-gray-300 shadow-md"
              />

              <button
                type="button"
                onClick={() => !profileImage && fileInputRef.current?.click()}
                className="absolute cursor-pointer bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full"
              >
                {!profileImage ? (
                  <Upload className="w-4 h-4" />
                ) : (
                  <X
                    className="w-4 h-4"
                    onClick={() => setProfileImage(null)}
                  />
                )}
              </button>
            </div>
            <input
              ref={fileInputRef}
              onChange={handleImageChange}
              type="file"
              name="avatar"
              id="fileInput"
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                Firstname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstname"
                placeholder="John"
                required
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label
                htmlFor="middlename"
                className="block text-sm font-medium text-gray-700"
              >
                Middlename
              </label>
              <input
                type="text"
                name="middleName"
                id="middlename"
                placeholder="Doe"
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Lastname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                id="lastname"
                placeholder="Smith"
                required
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john.doe@example.com"
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <div className="flex">
              <span className="p-2 mt-1 bg-gray-100 rounded-l-md border border-gray-300 border-r-2">
                +254
              </span>
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="7123456789"
                required
                className="mt-1 block bg-white border border-gray-300 border-l-0 rounded-r-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="johndoe"
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                placeholder="Password"
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md p-2 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {showPassword ? (
                <button
                  type="button"
                  className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-orange-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeOff />
                </button>
              ) : (
                <button
                  type="button"
                  className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-orange-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon />
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md transition hover:bg-orange-600"
          >
            {isSubmitting ? "Processing..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
