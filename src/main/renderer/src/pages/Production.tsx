"use client"

import { Suspense, useState } from "react"
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Move,
  Plus,
  Minus,
  BarChart3,
  Thermometer,
  Droplets,
  Award,
  Truck,
  AlertTriangle,
  Clock,
  User,
  Scale,
  Coffee,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

interface InventoryItem {
  id: string
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
  lastUpdated: string
  supplier: string
  certifications: string[]
  pricePerUnit: number
  totalValue: number
  minStockLevel: number
  maxStockLevel: number
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Reserved"
}

export default function CoffeeProduction() {
  const navigate = useNavigate()
  const params = useParams()
  const itemId = params.id as string
  const [item, setItem] = useState<InventoryItem>({
    id: "INV-2024-001",
    name: "Premium Bourbon Coffee Beans",
    category: "Green Coffee",
    variety: "Bourbon",
    processMethod: "Washed",
    quantity: 1250,
    unit: "kg",
    location: "Warehouse A",
    zone: "Section 3-B",
    qualityScore: 86.5,
    moistureContent: 11.2,
    harvestDate: "2024-02-15",
    lastUpdated: "2024-06-14",
    supplier: "Finca El Paraíso",
    certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
    pricePerUnit: 8.5,
    totalValue: 10625.0,
    minStockLevel: 500,
    maxStockLevel: 2000,
    status: "In Stock",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [quantityUpdate, setQuantityUpdate] = useState(0)
  const [updateReason, setUpdateReason] = useState("")
  const [showQuantityModal, setShowQuantityModal] = useState(false)

  const transactions = [
    { id: 1, type: "IN", quantity: 500, date: "2024-06-10", reason: "New harvest batch", user: "Maria Santos" },
    {
      id: 2,
      type: "OUT",
      quantity: 250,
      date: "2024-06-08",
      reason: "Export order #EX-2024-045",
      user: "Carlos Rodriguez",
    },
    { id: 3, type: "IN", quantity: 1000, date: "2024-06-01", reason: "Harvest delivery", user: "Juan Perez" },
    { id: 4, type: "OUT", quantity: 150, date: "2024-05-28", reason: "Quality testing samples", user: "Ana Lopez" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      case "Reserved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleQuantityUpdate = () => {
    if (quantityUpdate !== 0 && updateReason.trim()) {
      setItem((prev) => ({
        ...prev,
        quantity: prev.quantity + quantityUpdate,
        totalValue: (prev.quantity + quantityUpdate) * prev.pricePerUnit,
        lastUpdated: new Date().toISOString().split("T")[0],
      }))
      setQuantityUpdate(0)
      setUpdateReason("")
      setShowQuantityModal(false)
    }
  }

  const handleItemDelete = async (id: string) => {
    const response = await window.electron.invoke("inventory:remove", id)
    if (response.success) {
      navigate("/home/inventory")
    } else {
      alert("Failed to delete item")
    }
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                <p className="text-gray-600">ID: {item.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Edit size={16} className="inline mr-2" />
                Edit Item
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="mr-2 text-orange-600" size={20} />
                  Item Overview
                </h2>
                <button
                  onClick={() => setShowQuantityModal(true)}
                  className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-md hover:bg-orange-100 transition-colors text-sm"
                >
                  Update Quantity
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{item.quantity.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{item.unit}</div>
                  <div className="text-xs text-gray-500 mt-1">Current Stock</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">${item.totalValue.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Total Value</div>
                  <div className="text-xs text-gray-500 mt-1">
                    ${item.pricePerUnit}/{item.unit}
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{item.qualityScore}</div>
                  <div className="text-sm text-blue-600">Quality Score</div>
                  <div className="text-xs text-gray-500 mt-1">Cupping Score</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{item.moistureContent}%</div>
                  <div className="text-sm text-amber-600">Moisture</div>
                  <div className="text-xs text-gray-500 mt-1">Content Level</div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Coffee className="mr-2 text-orange-600" size={20} />
                Product Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="text-gray-900">{item.category}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coffee Variety</label>
                    <div className="text-gray-900">{item.variety}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Process Method</label>
                    <div className="text-gray-900">{item.processMethod}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <div className="text-gray-900">{item.supplier}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                    <div className="text-gray-900 flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {new Date(item.harvestDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <div className="text-gray-900 flex items-center">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                    <div className="flex flex-wrap gap-2">
                      {item.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"
                        >
                          <Award size={12} className="mr-1" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="mr-2 text-orange-600" size={20} />
                  Transaction History
                </h2>
                <button className="text-orange-600 hover:text-orange-700 text-sm flex items-center">
                  <Download size={16} className="mr-1" />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === "IN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type === "IN" ? (
                              <>
                                <TrendingUp size={12} className="inline mr-1" />
                                Stock In
                              </>
                            ) : (
                              <>
                                <TrendingDown size={12} className="inline mr-1" />
                                Stock Out
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {transaction.type === "IN" ? "+" : "-"}
                          {transaction.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-600">{transaction.reason}</td>
                        <td className="py-3 px-4 text-gray-600 flex items-center">
                          <User size={14} className="mr-1" />
                          {transaction.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location & Storage */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2 text-orange-600" size={20} />
                Location & Storage
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                  <div className="text-gray-900">{item.location}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone/Section</label>
                  <div className="text-gray-900">{item.zone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-gray-600">
                      <Thermometer size={14} className="mr-1 text-red-500" />
                      18-22°C
                    </span>
                    <span className="flex items-center text-gray-600">
                      <Droplets size={14} className="mr-1 text-blue-500" />
                      60-65% RH
                    </span>
                  </div>
                </div>
                <button className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
                  <Move size={16} className="mr-2" />
                  Move to Different Location
                </button>
              </div>
            </div>

            {/* Stock Levels */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="mr-2 text-orange-600" size={20} />
                Stock Management
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Stock</span>
                    <span className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: `${Math.min((item.quantity / item.maxStockLevel) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {item.minStockLevel}</span>
                    <span>Max: {item.maxStockLevel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-700">{item.minStockLevel}</div>
                    <div className="text-xs text-yellow-600">Min Level</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">{item.maxStockLevel}</div>
                    <div className="text-xs text-green-600">Max Level</div>
                  </div>
                </div>

                {item.quantity <= item.minStockLevel && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle size={16} className="text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">Low stock alert</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                  <RefreshCw size={16} className="mr-2" />
                  Reorder Stock
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Eye size={16} className="mr-2" />
                  View Quality Report
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Truck size={16} className="mr-2" />
                  Schedule Shipment
                </button>
                <button onClick={async() => handleItemDelete(item.id)} className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center">
                  <Trash2 size={16} className="mr-2" />
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Update Modal */}
        {showQuantityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Quantity</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Quantity: {item.quantity} {item.unit}
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantityUpdate((prev) => prev - 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={quantityUpdate}
                      onChange={(e) => setQuantityUpdate(Number.parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-center"
                      placeholder="0"
                    />
                    <button
                      onClick={() => setQuantityUpdate((prev) => prev + 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    New quantity: {item.quantity + quantityUpdate} {item.unit}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for update</label>
                  <select
                    value={updateReason}
                    onChange={(e) => setUpdateReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select reason...</option>
                    <option value="New delivery">New delivery</option>
                    <option value="Sale/Export">Sale/Export</option>
                    <option value="Quality testing">Quality testing</option>
                    <option value="Damage/Loss">Damage/Loss</option>
                    <option value="Transfer">Transfer to another location</option>
                    <option value="Inventory correction">Inventory correction</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowQuantityModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuantityUpdate}
                  disabled={quantityUpdate === 0 || !updateReason}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
