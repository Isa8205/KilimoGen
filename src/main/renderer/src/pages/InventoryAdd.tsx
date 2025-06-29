import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import notify from "../utils/ToastHelper";
import { useRecoilState } from "recoil";
import { sessionState } from "@/store/store";

export function InventoryForm() {
  const user = useRecoilState(sessionState)[0]
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ["image/jpeg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        notify(false, "Only JPEG or PNG images are allowed.");
        return;
      }

      if (file.size > maxSize) {
        notify(false, "File size exceeds 2MB. Please upload a smaller file.");
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
    const data = Object.fromEntries(formData as any); // Convert to an object
    data.weight = `${data.weight}${data.units}`;
    data.clerkId = user?.id

    const file = data.image;
    if (data.image) {
      const buffer = await file.arrayBuffer();
      const unit8Array = new Uint8Array(buffer);
      data.image = {
        type: file.type,
        data: unit8Array,
      };
    }

    const response = await window.electron.invoke("inventory:add-item", data);

    if (response.passed) {
      notify(response.passed, response.message);
      (e.target as any).reset();
      setImagePreview('')
    } else {
      notify(response.passed, response.message);
    }
  };

  return (
    <section className="p-6 text-gray-700">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
      >
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-2">
          Add New Product
        </h2>

        {/* Product Name */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label
            htmlFor="itemName"
            className="text-right font-medium text-sm text-gray-700"
          >
            Item Name
          </label>
          <input
            required
            id="itemName"
            name="itemName"
            className="col-span-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Category */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label
            htmlFor="category"
            className="text-right font-medium text-sm text-gray-700"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            className="col-span-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">-----Select category-----</option>
            <option value="Herbicide">Herbicide</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Seeds">Seeds</option>
            <option value="Fungicide">Fungicide</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="grid grid-cols-4 items-center gap-4">
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
            className="col-span-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Description */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label
            htmlFor="description"
            className="text-right font-medium text-sm text-gray-700 pt-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="col-span-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
          ></textarea>
        </div>

        {/* Weight/Volume */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label
            htmlFor="weight"
            className="text-right font-medium text-sm text-gray-700"
          >
            Weight/Volume
          </label>
          <div className="col-span-3 flex gap-2">
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              name="unit"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="ml">ml</option>
              <option value="g">g</option>
              <option value="kgs">kg(s)</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label
            htmlFor="image"
            className="text-right font-medium text-sm text-gray-700 pt-2"
          >
            Image
          </label>
          <div className="col-span-3">
            <div
              className="w-full h-64 bg-gray-100 border border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  Click to upload image
                </span>
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

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
