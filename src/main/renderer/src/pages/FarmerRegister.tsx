import { ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultImage from '../assets/images/backgrounds/CresentMountain.png'
import notify from '../utils/ToastHelper';

/**
 * Component for farmer registration
 *
 * This component contains the form for farmers to register on the platform.
 * The form contains fields for first name, middle name, last name, email, phone number, national ID, crops grown, and payment mode.
 * The form also contains a submit button which sends the form data to the server.
 * The component also contains a toast notification to notify the user of success or failure of the registration process.
 *
 * @returns A JSX element representing the FarmerRegister component
 */
const FarmerRegister = () => {
    const navigate = useNavigate();
    const [sendingState, setSendingState] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSendingState(true);
      const form: HTMLFormElement = e.currentTarget;
      const formdata = new FormData(form);

      const data = Object.fromEntries(formdata);

      const file = data.avatar
      if (data.avatar) {
        const arrayBuffer = await file.arrayBuffer()
        const unit8Array = new Uint8Array(arrayBuffer)

        data.avatar = {
          type: file.type,
          data: unit8Array
        }
      }

      await window.electron.invoke("add-farmer", {farmerDetails: data})
        .then(({passed, message}: {passed: boolean, message: string}) => {
          if (passed) {
            setSendingState(false);
            notify(passed, message)
            form.reset();
          } else {
            setSendingState(false);
            notify(passed, message);
          }
        })
        .catch((err: any) => {
          console.error(err)
        });
    };

    // Displaying the profile image on loading
    const profileInputRef = useRef()!
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      console.log(file)
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          const imageElement = document.querySelector('#profileDisplay') as HTMLImageElement;
          imageElement ? imageElement.src = imageUrl : null;
        };

        reader.readAsDataURL(file)
      }
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-00 text-gray-900">
        <ToastContainer />
        {/* Top Navigation Buttons */}
        <div className="bg-gray-100 flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="bg-white mt-6 pt-2 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Farmer Register
          </h1>

          <div onClick={() => profileInputRef.current.click()} className='flex justify-center h-[100px] mb-4'>
            <img id='profileDisplay' src={defaultImage} alt="farmer avatar" className='h-full w-[100px] object-cover rounded-full' />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" encType='multipart/form-data'>
            {/* Name Fields */}
            <input style={{display: 'none'}} ref={profileInputRef} onChange={handleImageChange}  type="file" accept='image/*' name="avatar" id="fileInput" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Firstname <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="firstName"
                  id="firstname"
                  placeholder="John"
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  required
                  type="text"
                  name="lastName"
                  id="lastname"
                  placeholder="Smith"
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                id="email"
                placeholder="john.doe@example.com"
                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Phone number field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <span className="flex items-center">
                <span className="p-2  mt-1 rounded-l-md text-center bg-gray-300 border border-gray-300">
                  +254
                </span>
                <input
                  required
                  type="number"
                  name="phone"
                  id="phone"
                  placeholder="712345678"
                  className="mt-1 block flex-grow bg-gray-50 border border-gray-300 rounded-r-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </span>
            </div>

            <div>
              <label
                htmlFor="national-id"
                className="block text-sm font-medium text-gray-700"
              >
                National ID <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                name="nationalID"
                id="national-id"
                placeholder="12345678"
                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Password Fields */}
            <div>
              <label
                htmlFor="crops"
                className="block text-sm font-medium text-gray-700"
              >
                Crops grown <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  required
                  type="text"
                  name="crop"
                  id="crops"
                  placeholder="Coffe, Maize, Beans"
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="payment-mode"
                className="block text-sm font-medium text-gray-700"
              >
                Payments Mode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  name="paymentMode"
                  id="payment-mode"
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                >
                  <option value="">-- Select one --</option>
                  <option value="M-pesa">Mpesa</option>
                  <option value="KCB">KCB bank</option>
                  <option value="Co-operative bank">Co-op</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`${
                sendingState ? 'opacity-70 hover:opacity-70' : ''
              } relative w-full bg-accent text-white py-2 px-4 rounded-lg shadow-md hover:opacity-90 focus:outline-none  duration-150 ease-in-out`}
            >
              {sendingState ? 'Sending......' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    );
  };

export default FarmerRegister;
