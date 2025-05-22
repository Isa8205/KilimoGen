"use client"

import type React from "react"

import { useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ChevronDown, Eye, Filter, RefreshCcw, Search } from "lucide-react"
import { report } from "process"
import useClickOutside from "@/hooks/useClickOutside"
import Modal from "@/components/Modal/Modal"

export default function ReportsComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<'id' | 'name' | 'date' | 'type'>("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [loading, setLoading] = useState(false)
  const [selectedReports, setSelectedReports] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [generateDropdown, setGenerateDropdown] = useState(false)
  const [deliveryGenModal, setDeliveryGenModal] = useState(false)
  const generateRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  const reports = [
    { id: 1, name: "Q1 Financial Report", date: "2025-03-31", type: "Financial" },
    { id: 2, name: "User Activity Analysis", date: "2025-04-15", type: "Analytics" },
    { id: 3, name: "Marketing Campaign Results", date: "2025-05-02", type: "Marketing" },
    { id: 4, name: "Product Performance", date: "2025-05-10", type: "Product" },
    { id: 5, name: "Customer Satisfaction Survey", date: "2025-05-18", type: "Customer" },
    { id: 6, name: "Monthly Sales Report", date: "2025-05-20", type: "Financial" },
  ]

  // Pagination
  const reportsPerPage = 5
  const totalPages = Math.ceil(reports.length / reportsPerPage)
  const paginatedReports = reports.slice((currentPage - 1) * reportsPerPage, currentPage * reportsPerPage)

  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1))
  }

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleView = (reportId: number) => {
    // This will be handled by the parent component
    console.log(`View report ${reportId}`)
  }

  const filters = ["All", "Financial", "Analytics", "Marketing"]

  // New report dropdown and modal logic
  useClickOutside(generateRef, () => {
    setGenerateDropdown(false)
  })

  return (
    <section className="text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Reports</h2>

        <span className="relative text-sm font-semibold">
          <button
            onClick={() => setGenerateDropdown(true)} 
            className="bg-[#F65A11] text-white py-1 px-4 rounded text-sm">
              Generate Report
            </button>

          {/* Dropdown for generating reports */}
          {generateDropdown && (              
            <div ref={generateRef} className="absolute right-0 left-0 mt-2 bg-white shadow-md rounded-md">
              <div className="py-2 px-2 text-gray-700">
                <button className="w-full block rounded px-2 py-2 text-start hover:bg-gray-100" onClick={() => {setDeliveryGenModal(true); setGenerateDropdown(false)}}>
                  Deliveries
                </button>
              </div>
            </div>
          )}
        </span>
      </div>

      <div className="bg-white p-5 flex shadow-md rounded-md">
        <span className="flex-grow border-x-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold">{reports.length}</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Financial</p>
          <span className="font-bold">{reports.filter((r) => r.type === "Financial").length}</span>
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
            placeholder="Enter report name or type"
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
              <span style={{ transform: isFilterOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}>
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                <ul className="py-2 text-gray-700">
                  {filters.map((filter) => (
                    <li
                      key={filter}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFilter(filter)
                        setIsFilterOpen(false)
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

      {/* Display the number of reports selected */}
      {selectedReports.length > 0 && (
        <div>
          <span className="text-sm font-semibold">{selectedReports.length} selected</span>
        </div>
      )}

      <table className={`bg-white ${!loading ? "shadow-md" : ""} rounded-md p-2 w-full table-auto border-collapse`}>
        <thead className="bg-gray-200 rounded-md">
          <tr className="text-center">

            <th className="p-2">Report Name</th>
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        {!loading ? (
          <tbody>
            {paginatedReports
              .filter((item) => (selectedFilter === "All" ? true : item.type === selectedFilter))
              .map((report, index) => (
                <tr
                  key={report.id}
                  className={`border-b last:border-none text-center ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="p-2 text-start">
                    <a href="#" className="hover:text-[#F65A11]">
                      {report.name}
                    </a>
                  </td>
                  <td className="p-2">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="p-2">{report.type}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleView(report.id)}
                      className="text-[#F65A11] hover:text-[#d44c0e] p-1 inline-flex items-center gap-1"
                    >
                      <Eye size={18} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        ) : null}
      </table>

      {!loading && paginatedReports.length > 0 ? (
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
      ) : paginatedReports.length === 0 ? (
        <div className="flex gap-3 flex-col justify-center items-center my-4">
          <div className="w-full h-[300px] flex items-center justify-center">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="No reports found"
              className="w-auto h-auto max-h-[300px]"
            />
          </div>
          <p className="text-gray-600">Ooops! No reports found</p>
          <button className="border border-gray-400 text-gray-500 hover:text-[#F65A11] hover:border-[#F65A11] rounded p-1 flex items-center gap-2">
            Refresh
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Delivery Generation Modal */}
      <Modal
        title="Deliveries Report"
        isOpen={deliveryGenModal}
        onClose={() => setDeliveryGenModal(false)}
      >
        <form
          onSubmit={ async (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const data = Object.fromEntries(formData as any)
            await window.electron.invoke("delivery:generate-report", data)
            console.log(data)
          }}
          >
          <div className="flex flex-col gap-4">
            {/* Set the title of the report */}
            <label htmlFor="reportTitle" className="text-sm font-semibold">Report Title <b className="text-red-600">*</b></label>
            <input
              type="text"
              id="reportTitle"
              name="reportTitle"
              placeholder="Enter report title"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#F65A11]"
              required
            />

            {/* Select the report type (comprehensive, Cherry, Mbuni) */}
            <label htmlFor="reportType" className="text-sm font-semibold">Report Coverage <b className="text-red-600">*</b></label>
            <select
              id="reportType"
              name="reportType"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#F65A11]"
              required
            >
              <option value="Comprehensive">Comprehensive</option>
              <option value="Cherry">Cherry</option>
              <option value="Mbuni">Mbuni</option>
            </select>


            <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              onClick={() => setDeliveryGenModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="bg-[#F65A11] text-white py-2 px-4 rounded-md">
              Generate
            </button>

            </div>
          </div>
        </form>
      </Modal>  
    </section>
  )
}
