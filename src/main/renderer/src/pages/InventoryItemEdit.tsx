"use client"

import type React from "react"

import { Suspense, useState } from "react"
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  MapPin,
  Package,
  AlertCircle,
  Camera,
} from "lucide-react"
import notify from "@/utils/ToastHelper"
import { ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"

interface FormData {
  name: string
  category: string
  quantity: number
  unitWeight: number
  unit: string
  location: string
  zone: string
  minStock: number
  maxStock: number
  description: string
  batchNumber: string
  origin: string
  images: File[]
}

const defaultFormData: FormData = {
    name:"",
    category: "",
    unitWeight: 0,
    quantity: 0,
    unit:"kg",
    location: "",
    zone:"",
    minStock: 0,
    maxStock: 0,
    description:"",
    batchNumber:"",
    origin:"",
    images: [],
  }

export default function InventoryItemForm({ isEdit = false }: { isEdit?: boolean; }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(defaultFormData)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ["Equipment", "Fertilizers", "Pesticides", "Seeds", "Packaging Materials"]
  const units = ["kg", "ml", "g", "bags", "tons", "pieces"]
  const locations = [
    "Warehouse A",
    "Warehouse B",
    "Processing Facility",
    "Drying Patio",
    "Storage Room 1",
    "Storage Room 2",
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Item name is required"
    if (!formData.unitWeight) newErrors.unitWeight = "Unit weight is required" // TODO: Add validation for unit weight
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (formData.minStock < 0) newErrors.minStock = "Minimum stock level cannot be negative"
    if (formData.maxStock <= formData.minStock) {
      newErrors.maxStock = "Maximum stock level must be greater than minimum"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const images = formData.images
    const imgaeBuffers: any[] = await Promise.all(images.map(async (image) => {
      const imagerArrayBuffer = await image.arrayBuffer()
      const imageUnit8Array = new Uint8Array(imagerArrayBuffer)
      return { type: image.type, data: imageUnit8Array, name: image.name }
    }));
    // Create new object to avoid mutating state directly and add images as Uint8Array
    const sendFormData = { ...formData, images: imgaeBuffers }

    setIsSubmitting(true)

    try {
      const res = await window.electron.invoke("inventory:add-item", sendFormData)
      notify(res.passed, res.message)

      if (res.passed) {
        (e.target as any).reset()
        setFormData(defaultFormData)
        setErrors({})
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen text-gray-800">
      <ToastContainer/>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEdit ? "Edit Inventory Item" : "Add New Inventory Item"}
                </h1>
                <p className="text-gray-600">
                  {isEdit ? "Update item information" : "Enter details for the new inventory item"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2 text-orange-600" size={20} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Weedal 480 SL Herbicide"
                autoFocus
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option>Select category....</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Weight *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.unitWeight}
                  onChange={(e) => handleInputChange("unitWeight", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.unitWeight ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select unit...</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., BT-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin/Supplier</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleInputChange("origin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Syngenta"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="Additional details about the item..."
              />
            </div>
          </div>

          {/* Quantity & Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-2 text-orange-600" size={20} />
              Quantity & Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", Number.parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", Number(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.minStock ? "border-red-500" : "border-gray-300"
                  }`}
                  min={0}
                />

                {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock</label>
                <input
                  type="number"
                  min={0}
                  value={formData.maxStock}
                  onChange={(e) => handleInputChange("maxStock", Number(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.maxStock ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., 1200-1800"
                />

                {errors.maxStock && <p className="text-red-500 text-sm mt-1">{errors.maxStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select location...</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zone/Section</label>
                <input
                  type="text"
                  value={formData.zone}
                  onChange={(e) => handleInputChange("zone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Section 3-B"
                />
              </div>

            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="mr-2 text-orange-600" size={20} />
              Images
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-gray-600">Click to upload images or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                  </label>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uploaded Images ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <AlertCircle size={16} className="mr-2" />
                Fields marked with * are required
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {isEdit ? "Update Item" : "Create Item"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
