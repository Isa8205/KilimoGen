"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ChevronDown, Download, Eye, Filter, RefreshCcw, Search } from "lucide-react"
import { report } from "process"
import useClickOutside from "@/hooks/useClickOutside"
import Modal from "@/components/Modal/Modal"
import notify, { properties } from "@/utils/ToastHelper"
import { toast } from "react-toastify"
import { formatDate } from "date-fns"

export default function ReportsComponent() {
  const [reports, setReports] = useState<{id: number, reportName: string, dateGenerated: Date, reportType: string}[]>([])
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

  // Fetch data from the database
  const fetchReports = async () => {
    setLoading(true)
    try {
      const data = await window.electron.invoke("report:get-all")
      setReports(data.reports)
    } catch (error) {
      console.error("Error fetching reports:", error)
      notify(false, "Failed to fetch reports")
    } finally {
      setLoading(false)
    }
    }
  

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

  // Handle file save
  const handleFileSave = async (reportId: number) => {
    try {
      const res = await window.electron.invoke("report:save-fs", reportId)
      if (res.passed) {
        toast.info(res.message, properties)
      } else {
        notify(res.passed, res.message)
      }
    } catch (error) {
      console.error("Error saving file:", error)
      notify(false, "Failed to save file")
    }
  }

  const dataFilters = useMemo(() => {
    const uniqueCategories = new Set<string>()
    reports.forEach((report) => {
      uniqueCategories.add(report.reportType)
    })
    return Array.from(uniqueCategories)
  }, [reports])
  const filters = ["All", ...dataFilters]

  // New report dropdown and modal logic
  useClickOutside(generateRef, () => {
    setGenerateDropdown(false)
  })

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <section className="text-black">
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
          <span className="font-bold">{reports.filter((r) => r.reportType === "Financial").length}</span>
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
            <th className="p-2">No.</th>
            <th className="p-2">Report Name</th>
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        {!loading ? (
          <tbody>
            {paginatedReports
              .filter((item) => (selectedFilter === "All" ? true : item.reportType === selectedFilter))
              .map((report, index) => (
                <tr
                  key={report.id}
                  className={`border-b last:border-none text-center ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{report.reportName}</td>
                  <td className="p-2">{formatDate(new Date(report.dateGenerated), 'dd-MMM-yyyy')}</td>
                  <td className="p-2">{report.reportType}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleFileSave(report.id)}
                      className="text-gray-800 border border-gray-200 bg-gray-50 px-2 py-1 rounded-md shadow-sm hover:text-accent p-1 inline-flex items-center gap-1"
                    >
                      <Download size={18} />
                      <span>Save</span>
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
            const res = await window.electron.invoke("delivery:generate-report", data)

            if (res.passed) {
              notify(res.passed, res.message)
              fetchReports() // Refresh the reports list
              setTimeout(() => {
                setDeliveryGenModal(false)
              }, 2500);
            } else {
              notify(res.passed, res.message)
            }
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
              <option value="all">Comprehensive</option>
              <option value="cherry">Cherry</option>
              <option value="mbuni">Mbuni</option>
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
