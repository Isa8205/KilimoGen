import { ArrowLeft, EyeIcon, Home } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../../assets/images/backgrounds/SunsetRed.png";

export default function ClerkRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const formRef = useRef<HTMLFormElement>(null)!;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Registered successfully!");
        }, 2000);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 relative"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="fixed top-4 left-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white hover:text-orange-500 hover:opacity-80 p-2 rounded-lg transition backdrop-blur-md border border-white/30 bg-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>

                <button
                    onClick={() => navigate("/home/dashboard")}
                    className="flex items-center gap-2 text-white hover:text-orange-500 hover:opacity-80 p-2 rounded-lg transition backdrop-blur-md border border-white/30 bg-white/10"
                >
                    <Home className="w-5 h-5" />
                    <span className="hidden sm:inline">Home</span>
                </button>
            </div>

            <div
                className="p-8 rounded-lg shadow-xl w-full max-w-md mt-6 animate-fadeIn"
                style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(25px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Signup</h1>
                <form className="flex flex-col gap-6" ref={formRef} onSubmit={handleSubmit}>
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
                                required
                                className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
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
                                className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
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
                                required
                                className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="john.doe@example.com"
                            required
                            className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
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
                            required
                            className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                required
                                placeholder="Password"
                                className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800 pr-10"
                            />
                            <EyeIcon
                                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-orange-500"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md transition ${
                                isSubmitting ? "cursor-wait opacity-70" : "hover:bg-orange-600"
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Signup"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
