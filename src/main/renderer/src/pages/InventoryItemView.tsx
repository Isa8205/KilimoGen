"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Move,
  BarChart3,
  Thermometer,
  Droplets,
  AlertTriangle,
  Clock,
  Scale,
  Coffee,
  Download,
  RefreshCw,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState } from "recoil";
import { sessionState } from "@/store/store";
import Modal from "@/components/Modal/Modal";
import notify from "@/utils/ToastHelper";
import { useQuery } from "@tanstack/react-query";

interface InventoryItem {
  id: string;
  itemName?: string;
  category: string;
  currentQuantity: number;
  unit: string;
  location: {id:number, name: string} | null;
  zone: string;
  lastUpdated: string;
  origin: string;
  minStock: number;
  maxStock: number;
  description: string;
  unitWeight: string;
  dateReceived: Date;
  receivedBy: {
    firstName: string;
    lastName: string;
  };
  transactions: {
    id: number;
    note: string;
    quantity: number;
    updatedAt: string;
    updateType: "restock" | "allocation" | "transfer";
    clerk: {
      firstName: string;
      lastName: string;
    };
  }[];
}

const defaults: InventoryItem = {
  id: "",
  itemName: "",
  category: "",
  currentQuantity: 0,
  unit: "",
  location: null,
  zone: "",
  lastUpdated: "",
  origin: "",
  minStock: 0,
  maxStock: 0,
  description: "",
  unitWeight: "",
  dateReceived: new Date(),
  receivedBy: {
    firstName: "",
    lastName: "",
  },
  transactions: [],
}

export default function InventoryItemDetail() {
  const [user] = useRecoilState(sessionState)
  const navigate = useNavigate()
  const params = useParams()
  const itemId = params.id as string
  const [item, setItem] = useState<InventoryItem>(defaults)

  const [showMoveModal, setShowMoveModal] = useState(false)
  const [newLocationId, setNewLocation] = useState("")
  const [newSection, setNewSection] = useState("")

    const {
      data: storageFacilities,
      isLoading,
      isFetched: isFetchedStorageFacilities,
    } = useQuery({
      queryKey: ["stores"],
      queryFn: async() => { 
        const res = await window.electron.invoke("stores:get-all")
        return res.data
      }
    })

  const fetchItemData = async () => {
    const res = await window.electron.invoke("inventory:get-item-data", Number(itemId))
    if (res) {
      setItem(res.item)
    }
  }

  // State for quantity update
  const [updateType, setUpdateType] = useState("")
  const [quantityUpdate, setQuantityUpdate] = useState(0)
  const [updateReason, setUpdateReason] = useState("")
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [updateQuantityErrors, setUpdateQuantityErrors] = useState<{
    quantity: string;
    type: string;
  }>({
    quantity: "",
    type: "",
  })

  const handleUpdateQuantitySubmit = async () => {
    // validate input
    if (quantityUpdate === 0) {
      setUpdateQuantityErrors({...updateQuantityErrors,
        quantity: "Must be greater than 0",
      })
      return
    }
    if (quantityUpdate > item.currentQuantity && updateType === "allocation") {
      setUpdateQuantityErrors({...updateQuantityErrors,
        quantity: "Cannot remove more than current stock",
      })
      return
    }
    if (updateType.trim() === "") {
      setUpdateQuantityErrors({...updateQuantityErrors,
        type: "Please select an action",
      })
    }

    setUpdateQuantityErrors({
      quantity: "",
      type: "",
    })

    try {
      const res = await window.electron.invoke("inventory:stock-update", {
        itemId: item.id,
        quantity: quantityUpdate,
        updateType: updateType,
        updateReason: updateReason,
      })
      
      notify(res.passed, res.message)
      if (res.passed) {
        setTimeout(() => {
          fetchItemData()
          setUpdateQuantityErrors({
            quantity: "",
            type: "",
          })
          setQuantityUpdate(0)
          setUpdateType("")
          setUpdateReason("")
          setShowQuantityModal(false)
        }, 1000)
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
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

  useEffect(() => {
    fetchItemData()
  }, [])

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
                <h1 className="text-2xl font-bold text-gray-900">{item?.itemName}</h1>
                <p className="text-gray-600">ID: {item?.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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
                {user && (
                  <button
                    onClick={() => setShowQuantityModal(true)}
                    className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-md hover:bg-orange-100 transition-colors text-sm"
                  >
                    Update Quantity
                  </button>
                )}
              </div>

              <div className="flex justify-between flex-wrap gap-4">
                <div className="flex-grow text-center p-4 bg-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{item?.currentQuantity.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">Current Stock</div>
                </div>
                <div className="flex-grow text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{(item?.currentQuantity * Number(item?.unitWeight)).toLocaleString()}</div>
                  <div className="text-xs text-green-500 mt-1">{item.unit}</div>
                  <div className="text-sm text-green-600">Total Value</div>

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
                    <div className="text-gray-900">{item?.category}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit measure</label>
                    <div className="text-gray-900">{item?.unitWeight} {item?.unit}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <div className="text-gray-900">{item?.description}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reception Date</label>
                    <div className="text-gray-900 flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {new Date(item.dateReceived).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <div className="text-gray-900 flex items-center">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      {item.transactions.length > 0 && new Date(item.transactions[0].updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Received by</label>
                    <div className="text-gray-900">{item?.receivedBy?.firstName} {item?.receivedBy?.lastName}</div>
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
                    <tr className="border-b border-gray-200 text-gray-700 font-medium">
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Reason</th>
                      <th className="text-left py-3 px-4">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item?.transactions?.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs text-nowrap font-medium ${
                              transaction.updateType === "restock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.updateType === "restock" ? (
                              <>
                                Stock In
                              </>
                            ) : (
                              <>
                                Stock Out
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-600">
                          {transaction.updateType === "restock" ? "+" : "-"}
                          {transaction.quantity}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{new Date(transaction.updatedAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-600">{transaction.note}</td>
                        <td className="py-3 px-4 text-gray-600 flex items-center">
                          {transaction?.clerk?.firstName} {transaction?.clerk?.lastName}
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
                  <div className="text-gray-900">{item?.location?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone/Section</label>
                  <div className="text-gray-900">{item?.zone}</div>
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
                <button 
                  onClick={() => setShowMoveModal(true)} 
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
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
                      {item?.currentQuantity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${Math.min((item?.currentQuantity / item?.maxStock) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {item?.minStock}</span>
                    <span>Max: {item?.maxStock}</span>
                  </div>
                </div>

                {item?.currentQuantity <= item?.minStock && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle size={16} className="text-red-600 mr-2" />
                    <span className="text-sm text-red-800">Low stock alert</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                  <RefreshCw size={16} className="mr-2" />
                  Reorder Stock
                </button>
                <button onClick={async() => handleItemDelete(item?.id)} className="w-full px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center">
                  <Trash2 size={16} className="mr-2" />
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Update Modal */}
          <Modal title="Update Quantity" isOpen={showQuantityModal} onClose={() => setShowQuantityModal(false)}>
              <div className="text-gray-700 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Quantity: {item?.currentQuantity}
                  </label>
                  <div className="flex justify-between mb-4">
                    <div>
                      <input
                        type="number"
                        name="quantityUpdate"
                        value={quantityUpdate}
                        onChange={(e) => setQuantityUpdate(Number.parseInt(e.target.value) || 0)}
                        className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-center ${updateQuantityErrors.quantity ? 'border-red-500' : ''}`}
                        placeholder="0"
                      />
                      {updateQuantityErrors.quantity && (
                        <div className="text-red-500 text-sm mt-1">
                          {updateQuantityErrors.quantity}
                        </div>
                      )}
                    </div>

                      <div>
                      <select onChange={(e) => setUpdateType(e.target.value)} name="updateType" id="update-type" className={`ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 ${updateQuantityErrors.type ? 'border-red-500' : ''}`}>
                        <option value="">Select action...</option>
                        <option value="restock">Restock</option>
                        <option value="allocation">Remove</option>
                      </select>
                      {updateQuantityErrors.type && (
                        <div className="text-red-500 text-sm mt-1">
                          {updateQuantityErrors.type}
                        </div>
                      )}
                      </div>
                  </div>
                  {updateType && (
                    <div className="text-sm text-gray-600 mb-2">
                      New quantity {updateType === "restock" ? item?.currentQuantity + quantityUpdate : item?.currentQuantity - quantityUpdate}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for update</label>
                  <input
                    type="text"
                    name="updateReason"
                    placeholder="Enter reason for update"
                    value={updateReason}
                    onChange={(e) => setUpdateReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="text-gray-700 flex space-x-3 mt-6">
                <button
                  onClick={() => setShowQuantityModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateQuantitySubmit()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update
                </button>
              </div>
          </Modal>

          {/* Move to a new location */}
          <Modal title="Move Item" isOpen={showMoveModal} onClose={() => setShowMoveModal(false)}>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (newLocationId && newSection) {
                window.electron.invoke("inventory:move-item", {
                  itemId: item.id,
                  newLocationId: Number(newLocationId),
                  newSection: newSection,
                }).then((res) => {
                  notify(res.passed, res.message)
                  if (res.passed) {
                    setTimeout(() => {
                      fetchItemData()
                      setShowMoveModal(false)
                      setNewLocation("")
                      setNewSection("")
                    }, 2500)
                  }
                })
              } else {
                notify(false, "Please select a location and section")
              }
            }}>
              <div className="text-gray-700 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Location</label>
                  <select
                    value={newLocationId}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a location...</option>
                    {isFetchedStorageFacilities && storageFacilities?.map((store: any) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Section/Zone</label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select zone...</option>
                    {isFetchedStorageFacilities && Array.from(storageFacilities.find((store: any) => store.id === Number(newLocationId))?.sections || []).map((section: any) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-gray-700 flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowMoveModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Move
                </button>
              </div>
            </form>
          </Modal>
      </div>
    </div>
  )
}
