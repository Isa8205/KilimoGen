"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  DollarSign,
  FileText,
  Filter,
  RefreshCcw,
  Search,
} from "lucide-react";
import { formatDate, set } from "date-fns";
import Modal from "@/components/Modal/Modal";
import notify from "@/utils/ToastHelper";
import useClickOutside from "@/hooks/useClickOutside";
import { useRecoilState } from "recoil";
import { sessionState } from "@/store/store";

interface Advance {
  id: number;
  farmer: {
    id: number;
    firstName: string;
    lastName: string;
    farmerNumber: number;
  };
  dateGiven: string;
  dateExpected: string;
  status: string;
}
export default function Advances() {
  const user = useRecoilState(sessionState)[0]
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAdvances, setSelectedAdvances] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const filters = ["All", "Pending", "Overdue", "Paid"];

  // Pagination
  const advancesPerPage = 5;
  const totalPages = Math.ceil(advances.length / advancesPerPage);
  const paginatedAdvances = advances.slice(
    (currentPage - 1) * advancesPerPage,
    currentPage * advancesPerPage
  );

  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelect = (id: number) => {
    if (selectedAdvances.includes(id)) {
      setSelectedAdvances(selectedAdvances.filter((item) => item !== id));
    } else {
      setSelectedAdvances([...selectedAdvances, id]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAdvances(paginatedAdvances.map((advance) => advance.id));
    } else {
      setSelectedAdvances([]);
    }
  };

  const handlePay = (advanceId: number) => {
  };

  // Add modal logic
  const addModalRef = useRef<HTMLFormElement>(null);
  useClickOutside(addModalRef, () => {
    setShowAddModal(false);
  });

  // Data fetch from api
  const fetchAdvances = async () => {
    setLoading(true);
    try {
      const data = await window.electron.invoke("advance:get-all");
      setAdvances(data.advances);
    } catch (error) {
      console.error("Error fetching advances:", error);
    } finally {
      setLoading(false);
    }
  };
  // Call fetchAdvances when the component mounts
  useEffect(() => {
    fetchAdvances();
  }, []);

  return (
    <section className="text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Advances</h2>

        <span className="inline-flex gap-2 text-sm font-semibold">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#F65A11] text-white py-1 px-4 rounded"
          >
            Add
          </button>
        </span>
      </div>

      <div className="bg-white p-5 flex shadow-md rounded-md">
        <span className="flex-grow border-x-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold">{advances.length}</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Pending</p>
          <span className="font-bold">
            {advances.filter((a) => a.status === "Pending").length}
          </span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Selected</p>
          <span className="font-bold">{selectedAdvances.length}</span>
        </span>
      </div>

      <div className="flex justify-between my-4">
        <span className="inline-flex items-center">
          <span className="bg-white px-2 py-1 rounded-l-md shadow-md text-gray-600">
            <Search />
          </span>
          <input
            onChange={handleSearch}
            type="text"
            name="search"
            id="search"
            placeholder="Enter farmer name or number"
            className="bg-white px-4 py-1 rounded-r-md shadow-md text-gray-600"
          />
        </span>

        <span className="flex gap-4 items-center">
          {/* Filter Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition"
            >
              <Filter className="w-5 h-5" />
              <span>{selectedFilter}</span>
              <span
                style={{
                  transform: isFilterOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                <ul className="py-2 text-gray-700">
                  {filters.map((filter) => (
                    <li
                      key={filter}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFilter(filter);
                        setIsFilterOpen(false);
                      }}
                    >
                      {filter}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </span>
      </div>

      {/* Display the number of advances selected */}
      {selectedAdvances.length > 0 && (
        <div>
          <span className="text-sm font-semibold">
            {selectedAdvances.length} selected
          </span>
        </div>
      )}

      <table
        className={`bg-white ${
          !loading ? "shadow-md" : ""
        } rounded-md p-2 w-full table-auto border-collapse`}
      >
        <thead className="bg-gray-200 rounded-md">
          <tr className="text-center">
            <th>No.</th>
            <th className="p-2">Farmer Number</th>
            <th className="p-2">Farmer Name</th>
            <th className="p-2">Date Given</th>
            <th className="p-2">Date Expected</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        {!loading ? (
          <tbody>
            {paginatedAdvances
              .filter((item) =>
                selectedFilter === "All" ? true : item.status === selectedFilter
              )
              .map((advance, index) => (
                <tr
                  key={advance.id}
                  className={`border-b last:border-none text-center ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td>{index + 1}</td>

                  <td className="p-2">
                  {advance.farmer.farmerNumber > 100
                      ? `0${advance.farmer.farmerNumber}`
                      : advance.farmer.farmerNumber > 10
                      ? `0${advance.farmer.farmerNumber}`
                      : advance.farmer.farmerNumber < 10
                      ? `00${advance.farmer.farmerNumber}`
                      : `0${advance.farmer.farmerNumber}`}
                  </td>
                  <td className="p-2 text-center">
                    <a href="#" className="hover:text-[#F65A11]">
                      {advance.farmer.firstName} {advance.farmer.lastName}
                    </a>
                  </td>
                  <td className="p-2">
                    {formatDate(new Date(advance.dateGiven), "dd-MMM-yyyy")}
                  </td>
                  <td className="p-2">
                    {formatDate(new Date(advance.dateExpected), "dd-MMM-yyyy")}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        advance.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : advance.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {advance.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handlePay(advance.id)}
                      className={`inline-flex items-center gap-1 p-1 ${
                        advance.status === "Paid"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#F65A11] hover:text-[#d44c0e]"
                      }`}
                      disabled={advance.status === "Paid"}
                    >
                      <DollarSign size={18} />
                      <span>Pay</span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        ) : null}
      </table>

      {!loading && paginatedAdvances.length > 0 ? (
        <div className="flex justify-end items-center my-4">
          <div className="flex gap-2">
            {currentPage !== 1 && (
              <button
                onClick={prevPage}
                className="bg-white text-gray-600 hover:text-[#F65A11] font-semibold text-xs py-1 px-2 rounded inline-flex items-center gap-2"
              >
                <ArrowLeft />
              </button>
            )}

            <span className="text-gray-600 bg-gray-300 inline-flex items-center p-2 rounded">
              {currentPage} / {totalPages}
            </span>

            {currentPage !== totalPages && (
              <button
                onClick={nextPage}
                className="text-gray-600 hover:text-[#F65A11] font-semibold text-xs py-1 px-2 bg-white rounded inline-flex items-center gap-2"
              >
                <ArrowRight />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-2 py-[100px] w-full flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#F65A11]"></div>
          <p className="text-gray-600">Loading.....</p>
        </div>
      ) : paginatedAdvances.length === 0 ? (
        <div className="flex gap-3 flex-col justify-center items-center my-4">
          <div className="w-full h-[300px] flex items-center justify-center">
            <FileText className="w-20 h-20 text-gray-400" />
          </div>
          <p className="text-gray-600">Ooops! No advances found</p>
          <button className="border border-gray-400 text-gray-500 hover:text-[#F65A11] hover:border-[#F65A11] rounded p-1 flex items-center gap-2">
            Refresh
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      <Modal
        title="Add Advance"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      >
        <form
          ref={addModalRef}
          onSubmit={async (e) => {
            e.preventDefault();
            const instance = new FormData(e.currentTarget);
            const data = Object.fromEntries(instance as any);
            data.clerkId = user?.id

            const response = await window.electron.invoke("advance:add", data);
            notify(response.passed, response.message);
            if (response.passed) {
              setTimeout(() => {
                setShowAddModal(false);
                fetchAdvances();
              }, 2500);
            }
          }}
        >
          <div className="mt-4">
            <label
              htmlFor="farmer-number"
              className="block text-sm font-medium text-gray-700"
            >
              Farmer Number
            </label>
            <input
              type="number"
              name="farmerNumber"
              id="farmer-number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="number"
              min={0}
              name="amount"
              id="amount"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason
            </label>
            <textarea
              cols={40}
              name="reason"
              id="reason"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            ></textarea>
          </div>

          <div className="mt-4">
            <label
              htmlFor="dateExpected"
              className="block text-sm font-medium text-gray-700"
            >
              Date Expected
            </label>
            <input
              type="date"
              name="dateExpected"
              id="dateExpected"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="bg-gray-600 text-white px-3 py-2 rounded-md"
            >
              Cancel
            </button>
            <button className="bg-orange-500 text-white px-3 py-2 rounded-md">
              Add
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
