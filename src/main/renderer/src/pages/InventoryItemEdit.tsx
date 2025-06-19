"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  Plus,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  Award,
  BarChart3,
  Droplets,
  AlertCircle,
  Camera,
} from "lucide-react"

interface FormData {
  name: string
  category: string
  variety: string
  processMethod: string
  quantity: number
  unit: string
  location: string
  zone: string
  qualityScore: number
  moistureContent: number
  harvestDate: string
  supplier: string
  certifications: string[]
  pricePerUnit: number
  minStockLevel: number
  maxStockLevel: number
  status: string
  description: string
  batchNumber: string
  origin: string
  altitude: string
  images: File[]
}

export default function InventoryItemForm({ isEdit = false, existingData = null }) {
  const [formData, setFormData] = useState<FormData>({
    name: existingData?.name || "",
    category: existingData?.category || "Green Coffee",
    variety: existingData?.variety || "",
    processMethod: existingData?.processMethod || "",
    quantity: existingData?.quantity || 0,
    unit: existingData?.unit || "kg",
    location: existingData?.location || "",
    zone: existingData?.zone || "",
    qualityScore: existingData?.qualityScore || 0,
    moistureContent: existingData?.moistureContent || 0,
    harvestDate: existingData?.harvestDate || "",
    supplier: existingData?.supplier || "",
    certifications: existingData?.certifications || [],
    pricePerUnit: existingData?.pricePerUnit || 0,
    minStockLevel: existingData?.minStockLevel || 0,
    maxStockLevel: existingData?.maxStockLevel || 0,
    status: existingData?.status || "In Stock",
    description: existingData?.description || "",
    batchNumber: existingData?.batchNumber || "",
    origin: existingData?.origin || "",
    altitude: existingData?.altitude || "",
    images: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCertification, setNewCertification] = useState("")

  const categories = ["Green Coffee", "Roasted Coffee", "Equipment", "Packaging", "Supplies"]
  const varieties = ["Bourbon", "Typica", "Caturra", "Catuai", "Geisha", "SL28", "SL34", "Pacamara", "Maragogype"]
  const processMethods = ["Washed", "Natural", "Honey Process", "Semi-washed", "Anaerobic Fermentation"]
  const units = ["kg", "lbs", "bags", "tons", "pieces"]
  const locations = [
    "Warehouse A",
    "Warehouse B",
    "Processing Facility",
    "Drying Patio",
    "Storage Room 1",
    "Storage Room 2",
  ]
  const statuses = ["In Stock", "Low Stock", "Out of Stock", "Reserved", "Quality Check", "Damaged"]

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

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }))
      setNewCertification("")
    }
  }

  const removeCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Item name is required"
    if (!formData.variety.trim()) newErrors.variety = "Coffee variety is required"
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (formData.qualityScore < 0 || formData.qualityScore > 100) {
      newErrors.qualityScore = "Quality score must be between 0 and 100"
    }
    if (formData.moistureContent < 0 || formData.moistureContent > 20) {
      newErrors.moistureContent = "Moisture content must be between 0 and 20%"
    }
    if (!formData.harvestDate) newErrors.harvestDate = "Harvest date is required"
    if (!formData.supplier.trim()) newErrors.supplier = "Supplier is required"
    if (formData.pricePerUnit <= 0) newErrors.pricePerUnit = "Price per unit must be greater than 0"
    if (formData.minStockLevel < 0) newErrors.minStockLevel = "Minimum stock level cannot be negative"
    if (formData.maxStockLevel <= formData.minStockLevel) {
      newErrors.maxStockLevel = "Maximum stock level must be greater than minimum"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Form submitted:", formData)
      // Handle success (redirect, show success message, etc.)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalValue = formData.quantity * formData.pricePerUnit

  return (
    <div className="min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                  placeholder="e.g., Premium Bourbon Coffee Beans"
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
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coffee Variety *</label>
                <select
                  value={formData.variety}
                  onChange={(e) => handleInputChange("variety", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.variety ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select variety...</option>
                  {varieties.map((variety) => (
                    <option key={variety} value={variety}>
                      {variety}
                    </option>
                  ))}
                </select>
                {errors.variety && <p className="text-red-500 text-sm mt-1">{errors.variety}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Process Method</label>
                <select
                  value={formData.processMethod}
                  onChange={(e) => handleInputChange("processMethod", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select process method...</option>
                  {processMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin/Farm</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleInputChange("origin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Finca El Paraíso"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altitude (masl)</label>
                <input
                  type="text"
                  value={formData.altitude}
                  onChange={(e) => handleInputChange("altitude", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., 1200-1800"
                />
              </div>
            </div>
          </div>

          {/* Quality & Dates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="mr-2 text-orange-600" size={20} />
              Quality & Dates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Score (0-100) *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.qualityScore}
                    onChange={(e) => handleInputChange("qualityScore", Number.parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      errors.qualityScore ? "border-red-500" : "border-gray-300"
                    }`}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <BarChart3 className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
                {errors.qualityScore && <p className="text-red-500 text-sm mt-1">{errors.qualityScore}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moisture Content (%) *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.moistureContent}
                    onChange={(e) => handleInputChange("moistureContent", Number.parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      errors.moistureContent ? "border-red-500" : "border-gray-300"
                    }`}
                    min="0"
                    max="20"
                    step="0.1"
                  />
                  <Droplets className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
                {errors.moistureContent && <p className="text-red-500 text-sm mt-1">{errors.moistureContent}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harvest Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      errors.harvestDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
                {errors.harvestDate && <p className="text-red-500 text-sm mt-1">{errors.harvestDate}</p>}
              </div>
            </div>
          </div>

          {/* Supplier & Certifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 text-orange-600" size={20} />
              Supplier & Certifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange("supplier", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.supplier ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Finca El Paraíso"
                />
                {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Certification</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Organic"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {formData.certifications.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center"
                    >
                      <Award size={12} className="mr-1" />
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCertification(cert)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Stock Levels */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="mr-2 text-orange-600" size={20} />
              Pricing & Stock Levels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit ($) *</label>
                <input
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleInputChange("pricePerUnit", Number.parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.pricePerUnit ? "border-red-500" : "border-gray-300"
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.pricePerUnit && <p className="text-red-500 text-sm mt-1">{errors.pricePerUnit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock Level *</label>
                <input
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) => handleInputChange("minStockLevel", Number.parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.minStockLevel ? "border-red-500" : "border-gray-300"
                  }`}
                  min="0"
                />
                {errors.minStockLevel && <p className="text-red-500 text-sm mt-1">{errors.minStockLevel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Stock Level *</label>
                <input
                  type="number"
                  value={formData.maxStockLevel}
                  onChange={(e) => handleInputChange("maxStockLevel", Number.parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    errors.maxStockLevel ? "border-red-500" : "border-gray-300"
                  }`}
                  min="0"
                />
                {errors.maxStockLevel && <p className="text-red-500 text-sm mt-1">{errors.maxStockLevel}</p>}
              </div>
            </div>

            {totalValue > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="text-green-600 mr-2" size={20} />
                  <span className="text-green-800 font-medium">
                    Total Value: $
                    {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
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
