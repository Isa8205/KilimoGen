"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { ToastContainer } from "react-toastify"
import notify from "@/utils/ToastHelper"
import { useQueryClient } from "@tanstack/react-query"

interface AddSeasonModalProps {
  onClose: () => void
}

export function AddSeasonModal({ onClose }: AddSeasonModalProps) {
  const [sending, setSending] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData as any)

    try {
      // Replace with your actual API call
      const res = await window.electron.invoke("seasons:add", data)
      notify(res.passed, res.message)

      if (res.passed) {
        queryClient.invalidateQueries({ queryKey: ["seasons"] })
        onClose()
      }
    } catch (err) {
      console.error("Error submitting form: ", err)
      notify(false, "Failed to add season")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <ToastContainer />
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary">Add New Season</h3>
          <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Season Name</label>
            <input
              type="text"
              name="seasonName"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="e.g., 2024/25"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Season Target (kg)</label>
            <input
              type="number"
              name="target"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="e.g., 1000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Description (optional)</label>
            <textarea
              rows={3}
              name="description"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Season notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              disabled={sending}
            >
              {sending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Create Season"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
