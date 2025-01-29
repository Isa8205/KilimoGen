import { ArrowLeft, EyeIcon, Home } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgrounds/SunsetRed.png';
import axios from 'axios';

export default function ClerkRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null)!;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);
    const data = Object.fromEntries(formdata);
    console.log(data);

    setIsSubmitting(true);

    await axios
      .post('http://localhost:3000/api/clerk/add', data, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((res) => {
        console.log(res.data);
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsSubmitting(false);
      });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          onClick={() => navigate('/home/dashboard')}
          className="flex items-center gap-2 text-white hover:text-orange-500 hover:opacity-80 p-2 rounded-lg transition backdrop-blur-md border border-white/30 bg-white/10"
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      <div
        className="p-8 rounded-lg shadow-xl w-full max-w-md mt-6 animate-fadeIn"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Signup
        </h1>
        <form
          className="flex flex-col gap-6"
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
            <div
              className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer group"
              id="avatarContainer"
            >
              <div className="relative flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition">
                <span
                  className="absolute inset-0 text-gray-500 text-4xl font-bold"
                  id="plusIcon"
                >
                  +
                </span>
              </div>

              <img
                id="avatarPreview"
                className="w-full h-full object-cover hidden"
                alt="Avatar Preview"
              />
            </div>
            <input type="file" name='avatar' id="fileInput" accept="image/*" className="" />

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
                className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
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
                className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
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
                className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
              />
            </div>
          </div>

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
              className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="number"
              name="phone"
              id="phone"
              placeholder="johndoe"
              required
              className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
            />
          </div>

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
              className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              required
              className="mt-1 block w-full bg-transparent border-b border-gray-300  focus:border-orange-500 transition p-2 text-gray-800"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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
                isSubmitting ? 'cursor-wait opacity-70' : 'hover:bg-orange-600'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Signup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


