"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import notify from "@/utils/ToastHelper";
import { useQuery } from "@tanstack/react-query";

interface AddStoreModalProps {
  onClose: () => void;
  fetchFn: () => void;
}

/**
 * A modal for adding a new store.
 *
 * @param onClose - The function to call when the modal is closed.
 */
export function AddStoreModal({ onClose, fetchFn }: AddStoreModalProps) {
  const [sending, setSending] = useState(false);
  const [sectionsCount, setSectionCount] = useState(1);

    const {
        data: clerksData,
        isLoading: isClerksLoading,
        isError: isClerksError,
        refetch: refetchClerks,
    } = useQuery({
        queryKey: ["clerks"],
        queryFn: async () => {
        return await window.electron.invoke("get-clerks")
        },
    })
    // Copilot: Use React Query data
    const clerks = clerksData || []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData as any);
    data.sections = formData.getAll("sections")
    console.log(data)

    try {
      // Replace with your actual API call
      const res = await window.electron.invoke("stores:add", data);
      notify(res.passed, res.message);

      if (res.passed) {
        fetchFn()
        onClose();
      }
    } catch (err) {
      console.error("Error submitting form: ", err);
      notify(false, "Failed to add store");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <ToastContainer />
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary">Add New Store</h3>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Store Name*
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="e.g., Warehouse A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Store Sections (at least one)
            </label>
            {Array.from({ length: sectionsCount }).map((_, index) => (
              <div className="flex gap-4 my-4">
                <input
                  key={index}
                  type="text"
                  name={`sections`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder={`Section ${index + 1}`}
                  required
                />
                { index + 1 < sectionsCount && (
                  <button
                    type="button"
                    onClick={() => setSectionCount(sectionsCount - 1)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                )}
                { index + 1 === sectionsCount && (
                  <button
                    type="button"
                    onClick={() => setSectionCount(sectionsCount + 1)}
                    className="text-teal-600 hover:underline text-sm"
                  >
                    New
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
                Asignee*
            </label>

            <select name="asigneeId" id="asignee" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                <option value="----Select---">--- select ---</option>
                {clerks.map((clerk: any) => (
                    <option value={clerk.id}>{clerk.firstName} {clerk.lastName}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Description (optional)
            </label>
            <textarea
              rows={3}
              name="description"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Store notes..."
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
                "Add Store"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
