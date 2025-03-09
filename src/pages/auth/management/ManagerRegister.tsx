import { ArrowLeft, EyeIcon, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManagerRegister() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">

                {/* Top Navigation Buttons */}
            <div className="fixed top-0 bg-gray-100 left-0 right-0 flex items-center gap-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-lg transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>

                {/* Home Button */}
                <button
                    onClick={() => navigate("/home/dashboard")}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-lg transition"
                >
                    <Home className="w-5 h-5" />
                    <span className="hidden sm:inline">Home</span>
                </button>
            </div>

            <div className="bg-white mt-6 pt-2 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Signup</h1>
                <form className="flex flex-col gap-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                Firstname <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                id="firstname"
                                placeholder="John"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="middlename" className="block text-sm font-medium text-gray-700">
                                Middlename
                            </label>
                            <input
                                type="text"
                                name="middlename"
                                id="middlename"
                                placeholder="Doe"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                Lastname <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                id="lastname"
                                placeholder="Smith"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Username Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="john.doe@example.com"
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="johndoe"
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Password Fields */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            />
                            <EyeIcon
                                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirm-password"
                                id="confirm-password"
                                placeholder="&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-accent text-white py-2 px-4 rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Signup
                    </button>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        Already have an account?{" "}
                        <a href="/auth/manager/login" className="text-orange-600 hover:underline">
                            Log in
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
