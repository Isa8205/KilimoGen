"use client"

import { useEffect, useState } from "react"
import {
  User,
  Palette,
  Bell,
  Shield,
  Smartphone,
  RefreshCw,
  CreditCard,
  Eye,
  EyeOff,
  Check,
  X,
  Edit,
  TrashIcon,
  Globe,
  Package,
} from "lucide-react"
import { useRecoilState } from "recoil"
import { sessionState, settingsState } from "@/store/store"
import defaultUser from "@/assets/images/defaultUser.png"
import notify from "@/utils/ToastHelper"
import Modal from "@/components/Modal/Modal"

export default function SettingsPage() {
  const user = useRecoilState(sessionState)[0]
  const [activeCategory, setActiveCategory] = useState("general")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showChangePass, setShowChangePass] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const settings = useRecoilState(settingsState)[0]
  let devicePrinters;

  const categories = [
    { id: "general", name: "General", icon: <Globe size={20} /> },
    { id: "account", name: "Account & Security", icon: <User size={20} /> },
    { id: "production", name: "Production", icon: <Package size={20} /> },
    // { id: "profile", name: "Profile Settings", icon: <Palette size={20} /> },
    // { id: "notifications", name: "Notification Settings", icon: <Bell size={20} /> },
    // { id: "privacy", name: "Privacy Settings", icon: <Shield size={20} /> },
    // { id: "device", name: "Device & App Settings", icon: <Smartphone size={20} /> },
    // { id: "sync", name: "Sync & Integration", icon: <RefreshCw size={20} /> },
    // { id: "billing", name: "Billing & Subscription", icon: <CreditCard size={20} /> },
  ]

  useEffect(() => {
    (async () => {
      try {
        const res = await window.electron.invoke("printer:get-all")
        devicePrinters = res
        
      } catch (error) {
        notify(false, "Failed to fetch device printers")
      }
    })()
  })

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto text-black">
        {activeCategory === "general" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Default preferences</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-700">Default Receipt Printer</p>
                      <span>{settings.printing.defaultReceiptPrinter || "-----Not set----"}</span>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500">
                        <option>Printer 1</option>
                        <option>Printer 2</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "account" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account & Security Settings</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile picture / avatar</label>
                <div className="flex items-center justify-between space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={user?.avatar ? `data:image/png;base64,${user?.avatar}` : defaultUser}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">
                      <Edit size={16} /> Edit
                    </button>
                    <button className="inline-flex gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-red-500 hover:text-white">
                      <TrashIcon size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username / Display name
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={user?.username}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    defaultValue="john.doe@example.com"
                  />
                </div>

                <div>
                  <button
                    className="mt-2 text-sm text-orange-600 hover:text-orange-800"
                    onClick={() => setShowChangePass(true)}
                  >
                    Change password
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Two-Factor Authentication (2FA)</label>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        twoFactorEnabled ? "bg-orange-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {twoFactorEnabled
                      ? "2FA is enabled. Your account has an extra layer of security."
                      : "Enable 2FA for additional account security."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "production" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Production Settings</h3>

              <div>

              </div>
            </div>
        )}

        {activeCategory === "profile" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile picture / avatar</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <button className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">
                        Upload new
                      </button>
                      <button className="px-3 py-1.5 ml-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / status / tagline
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    defaultValue="Product designer and developer based in New York."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option>Prefer not to say</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      defaultValue="New York, USA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="theme" className="h-4 w-4 text-orange-600" defaultChecked />
                      <span className="ml-2">Light</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="theme" className="h-4 w-4 text-orange-600" />
                      <span className="ml-2">Dark</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="theme" className="h-4 w-4 text-orange-600" />
                      <span className="ml-2">System</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    Language / locale
                  </label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "notifications" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Email notifications</h4>
                  <div className="space-y-3">
                    {["New messages", "Account updates", "Product updates", "Marketing emails"].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item}</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Push notifications</h4>
                  <div className="space-y-3">
                    {["New messages", "Mentions", "Friend requests", "Updates"].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item}</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">In-app notifications</h4>
                  <div className="space-y-3">
                    {["Activity on your posts", "New followers", "System notifications"].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item}</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Frequency controls</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email-frequency" className="block text-sm text-gray-700 mb-1">
                        Email digest frequency
                      </label>
                      <select
                        id="email-frequency"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option>Real-time</option>
                        <option>Daily summary</option>
                        <option>Weekly digest</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "privacy" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Who can see your profile</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="profile-visibility"
                        className="h-4 w-4 text-orange-600"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Everyone</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="profile-visibility" className="h-4 w-4 text-orange-600" />
                      <span className="ml-2 text-sm text-gray-700">Only followers</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="profile-visibility" className="h-4 w-4 text-orange-600" />
                      <span className="ml-2 text-sm text-gray-700">Only people you follow</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Who can contact you</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contact-permissions"
                        className="h-4 w-4 text-orange-600"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Everyone</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="contact-permissions" className="h-4 w-4 text-orange-600" />
                      <span className="ml-2 text-sm text-gray-700">Only followers</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="contact-permissions" className="h-4 w-4 text-orange-600" />
                      <span className="ml-2 text-sm text-gray-700">Nobody</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Blocked users</h4>
                  <div className="border border-gray-200 rounded-md divide-y max-h-40 overflow-y-auto">
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <span>blockeduser1</span>
                      </div>
                      <button className="text-orange-600 text-sm hover:text-orange-800">Unblock</button>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <span>spammer123</span>
                      </div>
                      <button className="text-orange-600 text-sm hover:text-orange-800">Unblock</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Ad tracking / data sharing preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Allow personalized ads</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Share usage data</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Allow third-party cookies</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Search visibility</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show profile in search results</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "device" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Device & App Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Mobile vs. Desktop toggles</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Use mobile layout on tablets</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Optimize for touch on desktop</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Auto-play media</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-play videos</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-play GIFs</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Download quality</h4>
                  <div>
                    <label htmlFor="video-quality" className="block text-sm text-gray-700 mb-1">
                      Video quality
                    </label>
                    <select
                      id="video-quality"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option>Auto (recommended)</option>
                      <option>Low - Save data</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Accessibility options</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="text-size" className="block text-sm text-gray-700 mb-1">
                        Text size
                      </label>
                      <select
                        id="text-size"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option>Small</option>
                        <option>Medium (default)</option>
                        <option>Large</option>
                        <option>Extra Large</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">High contrast mode</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Screen reader support</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Reduce animations</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "sync" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sync & Integration Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Linked accounts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold">G</span>
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-xs text-gray-500">Connected as john.doe@gmail.com</p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm hover:text-red-800">Disconnect</button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">f</span>
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-xs text-gray-500">Not connected</p>
                        </div>
                      </div>
                      <button className="text-orange-600 text-sm hover:text-orange-800">Connect</button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">A</span>
                        </div>
                        <div>
                          <p className="font-medium">Apple</p>
                          <p className="text-xs text-gray-500">Not connected</p>
                        </div>
                      </div>
                      <button className="text-orange-600 text-sm hover:text-orange-800">Connect</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Third-party app access</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-bold">S</span>
                        </div>
                        <div>
                          <p className="font-medium">Spotify</p>
                          <p className="text-xs text-gray-500">Access to profile and playlists</p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm hover:text-red-800">Revoke</button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">C</span>
                        </div>
                        <div>
                          <p className="font-medium">Calendar App</p>
                          <p className="text-xs text-gray-500">Access to calendar events</p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm hover:text-red-800">Revoke</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Cloud sync</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sync settings across devices</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sync history</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Backup & restore options</h4>
                  <div className="space-y-3">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">
                      Backup data now
                    </button>
                    <div>
                      <p className="text-xs text-gray-500">Last backup: May 10, 2025, 2:30 PM</p>
                    </div>
                    <div className="pt-2">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50">
                        Restore from backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "billing" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing & Subscription</h3>
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-orange-800">Pro Plan</h4>
                      <p className="text-sm text-orange-600">$9.99/month</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Active</span>
                  </div>
                  <div className="mt-2 text-sm text-orange-600">Next billing date: June 15, 2025</div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Payment methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                          <span className="text-gray-800 font-bold">V</span>
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-xs text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded mr-2">Default</span>
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-orange-600 hover:text-orange-800">+ Add payment method</button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Subscription plans</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-md p-4">
                      <h5 className="font-medium">Basic</h5>
                      <p className="text-lg font-bold mt-1">Free</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>Limited features</span>
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>Basic support</span>
                        </li>
                        <li className="flex items-center">
                          <X size={16} className="text-red-500 mr-2" />
                          <span className="text-gray-500">Advanced features</span>
                        </li>
                      </ul>
                    </div>
                    <div className="border-2 border-orange-500 rounded-md p-4 relative">
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-md">
                        Current
                      </div>
                      <h5 className="font-medium">Pro</h5>
                      <p className="text-lg font-bold mt-1">$9.99/mo</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>All features</span>
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>Advanced analytics</span>
                        </li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4">
                      <h5 className="font-medium">Enterprise</h5>
                      <p className="text-lg font-bold mt-1">$49.99/mo</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>All Pro features</span>
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>24/7 support</span>
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>Custom solutions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Invoice history</h4>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">May 15, 2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">$9.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <button className="text-orange-600 hover:text-orange-800">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Apr 15, 2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">$9.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <button className="text-orange-600 hover:text-orange-800">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Mar 15, 2025</td>
                          <td className="px-4 py-3 text-sm text-gray-900">$9.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <button className="text-orange-600 hover:text-orange-800">Download</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50">
                    Cancel subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showChangePass && (
        <Modal title="Change Password" isOpen={showChangePass} onClose={() => setShowChangePass(false)}>
          <form
            className="text-black"
            onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const data = Object.fromEntries(formData as any)
              if (data.new !== data.confirm) {
                notify(false, "New passwords do not match")
                return
              }
              try {
                const res = await window.electron.invoke("change-password", data)
                notify(res.passed, res.message)
              } catch (err) {
                console.error("Error submitting form: ", err)
              }
            }}
          >
            <div className="mt-4">
              <label htmlFor="current" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="current"
                id="current"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="new" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassModal ? "text" : "password"}
                  name="new"
                  id="new"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassModal(!showPassModal)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-black leading-5"
                >
                  {!showPassModal ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type={showPassModal ? "text" : "password"}
                name="confirm"
                id="confirm"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => setShowChangePass(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Change Password
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
