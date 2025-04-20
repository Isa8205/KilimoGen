import { ArrowLeft, Home } from "lucide-react";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManagerLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 relative">
            {/* Top Navigation Buttons */}
            <div className="absolute top-4 left-4 flex items-center gap-4">
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

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
                <form className="flex flex-col gap-6">
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username or email
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="eg. John Doe"
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Password Field */}
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
                                aria-label="Toggle password visibility"
                            />
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <a href="/forgot-password" className="text-sm text-orange-600 hover:underline">
                            Forgot your password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-accent text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Login
                    </button>

                    {/* Divider for Alternative Actions */}
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account?{" "}
                        <a href="/auth/manager/register" className="text-orange-600 hover:underline">
                            Sign up here
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
