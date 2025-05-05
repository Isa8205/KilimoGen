import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import notify from '../utils/ToastHelper';

export function InventoryForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        notify(false, 'Only JPEG or PNG images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        notify(false, 'File size exceeds 2MB. Please upload a smaller file.');
        return;
      }

      if (imagePreview) URL.revokeObjectURL(imagePreview); // Clean up old preview
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget); // Collect form data
    const data = Object.fromEntries(formData); // Convert to an object

    const response = await axios.post('http://localhost:3000/api/inventory/add', data, {headers: {'Content-Type': 'multipart/form-data'}});

    if (response.data.passed) {
      notify(response.data.passed, response.data.message);
      e.currentTarget.reset()
    } else {
      notify(response.data.passed, response.data.message)
    }
  };

  //   Get the clerks for referencing
  const [clerks, setClerks] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const getClerks = async () => {
    const response = await axios.get('http://localhost:3000/api/clerk');
    return response.data.clerks;
  };

  useEffect(() => {
    getClerks().then((data) => setClerks(data));
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-lg mx-auto text-gray-700">
      <ToastContainer />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Product Name */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="productName"
            className="text-right font-medium text-sm text-gray-700"
          >
            Product Name
          </label>
          <input
            required
            id="productName"
            name="productName"
            className="col-span-3 p-2 border rounded-md focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="category"
            className="text-right font-medium text-sm text-gray-700"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            className="col-span-3 p-2 border rounded-md"
          >
            <option value="">-----Select category-----</option>
            <option value="Herbicide">Herbicide</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Seeds">Seeds</option>
            <option value="Fungicide">Fungicide</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="quantity"
            className="text-right font-medium text-sm text-gray-700"
          >
            Quantity
          </label>
          <input
            required
            id="quantity"
            name="quantity"
            type="number"
            className="col-span-3 p-2 border rounded-md focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="description"
            className="text-right font-medium text-sm text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="col-span-3 p-2 border rounded-md focus:outline-none"
            rows={3}
          ></textarea>
        </div>

        {/* Weight */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="weight"
            className="text-right font-medium text-sm text-gray-700"
          >
            Weight/volume
          </label>
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            className="col-span-3 p-2 border rounded-md focus:outline-none"
          />
        </div>

        {/* Date Received */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="dateReceived"
            className="text-right font-medium text-sm text-gray-700"
          >
            Date Received
          </label>
          <input
            required
            id="dateReceived"
            name="dateReceived"
            type="date"
            className="col-span-3 p-2 border rounded-md focus:outline-none"
          />
        </div>

        {/* Received By */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="receivedBy"
            className="text-right font-medium text-sm text-gray-700"
          >
            Received By
          </label>
          <select
            name="receivedBy"
            id="receivedBy"
            className="col-span-3 p-2 border rounded-md"
          >
            <option value="">-----Select-----</option>
            {clerks.map((clerk) => (
              <option key={clerk.id} value={clerk.id}>
                {clerk.firstName}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div className="grid grid-cols-4 items-center gap-4 mb-4">
          <label
            htmlFor="image"
            className="text-right font-medium text-sm text-gray-700"
          >
            Image
          </label>
          <div className="col-span-3">
            <div
              className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:opacity-75"
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-500 text-sm">Upload Image</span>
              )}
            </div>
            <input
              id="imageInput"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-dark"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
