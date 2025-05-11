import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter,
  RefreshCcw,
  Search,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../components/Loaders/Loader1";
import { NavLink } from "react-router-dom";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { farmersState, sessionState } from "@/store/store";
import errorImage from "@/assets/images/backgrounds/404_2.svg";
import { DropDown } from "@/components/DropDown";
import Modal from "@/components/Modal/ExportModal";
import { toast } from "react-toastify";
import notify, { properties } from "@/utils/ToastHelper";
export function Farmers() {
  // Get the session data
  const user = useRecoilState(sessionState)[0];

  // Fetching farmers from the database
  const [dbfarmers, setFarmers] = useRecoilState(farmersState);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages));
  };

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await window.electron.invoke("get-farmers", {
        itemsPerPage: itemsPerPage,
        page: currentPage,
      });
      setFarmers(response.farmers);
      setTotalPages(response.totalPages);
      document.getElementById("totalFarmers")!.textContent =
        response.totalFarmers;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [currentPage]);

  // Search functionality
  const [query, setQuery] = useState("");
  const searcRef = useRef<HTMLInputElement>(null);
  const handleSearch = () => {
    setQuery(searcRef.current!.value);
  };
  const fuse = new Fuse(dbfarmers, { keys: ["firstName", "lastName", "id"] });
  const filteredFarmers = fuse.search(query).map((result) => result.item);
  const farmers = query ? filteredFarmers : dbfarmers;

  // Filter dropdown and functionality
  const [selectedFilter, setSelectedFilter] = useState("All");
  const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const filters = ["All", "With Produce", "No Produce"];

    useEffect(() => {
      setSelectedFilter(() => localStorage.getItem("selectedFilter") || "All");
    }, []);
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition"
        >
          <Filter className="w-5 h-5" />
          <span>{selectedFilter}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
            <ul className="py-2 text-gray-700">
              {filters.map((filter) => (
                <li
                  key={filter}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedFilter(filter);
                    localStorage.setItem("selectedFilter", filter);
                    setIsOpen(false);
                  }}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Individual farmer selection and all selection
  const [selectedFarmers, setselectedFarmers] = useState<string[]>([]);
  const handleSelect = (id: string) => {
    if (selectedFarmers.includes(id)) {
      setselectedFarmers(selectedFarmers.filter((item) => item !== id));
    } else {
      setselectedFarmers([...selectedFarmers, id]);
    }
  };

  const handleselectall = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (checked) {
      setselectedFarmers(farmers.map((farmer) => farmer.id.toString()));
    } else {
      setselectedFarmers([]);
    }
  };

  // Export Modal realted stuff
  const [exportFarmerModal, setExportFarmerModal] = useState(false);
  const [fileName, setFileName] = useState('')
  const [format, setFormat] = useState("pdf");
  const [range, setRange] = useState("all");
  const [startNumber, setStartNumber] = useState(1);
  const [stopNumber, setStopNumber] = useState(350);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      fileName,
      format,
      range,
      startNumber: range === "from" ? startNumber : null,
      stopNumber: range === "from" ? stopNumber : null
    };
    await window.electron.invoke('export-farmers', data)
    toast.info("File was saved in Documents/Kilimogen", properties)
    setExportFarmerModal(false);
  };

  return (
    <section className="text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Farmers</h2>

        {user && (
          <span className="inline-flex gap-2 text-sm font-semibold">
            <div>
              <button
                className="bg-white text-black shadow-sm py-1 px-4 rounded"
                onClick={() => setExportFarmerModal(true)}
              >
                Export
              </button>
            </div>
            <NavLink to="/home/farmers/add">
              <button className="bg-accent text-white py-1 px-4 rounded">
                Add
              </button>
            </NavLink>
          </span>
        )}
      </div>

      <div className="bg-white p-5 flex shadow-md rounded-md">
        <span className="flex-grow border-x-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold" id="totalFarmers">
            0
          </span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Active</p>
          <span className="font-bold">{farmers.length}</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Selected</p>
          <span className="font-bold">{selectedFarmers.length}</span>
        </span>
      </div>

      <div className="flex justify-between my-4">
        <span className="inline-flex items-center">
          <span className="bg-white px-2 py-1 rounded-l-md shadow-md text-gray-600">
            <Search />
          </span>
          <input
            onChange={handleSearch}
            ref={searcRef}
            type="text"
            name="search"
            id="search"
            placeholder="Enter name or number"
            className="bg-white px-4 py-1 rounded-r-md shadow-md text-gray-600"
          />
        </span>

        <span className="flex gap-4 items-center">
          <FilterDropdown />
        </span>
      </div>

      {/* Display the number of people selected */}
      {selectedFarmers.length > 0 && (
        <div>
          <span className="text-sm font-semibold">
            {selectedFarmers.length} selected
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
            {/* Checkbox header */}
            {user && (
              <th className=" p-2">
                <input
                  onChange={(e) => handleselectall(e)}
                  checked={selectedFarmers.length === farmers.length}
                  type="checkbox"
                  name="select-all"
                  id="all"
                />
              </th>
            )}
            {/* Table headers */}
            <th className="p-2">Name</th>
            <th className="p-2">Farmer No.</th>
            <th className="p-2">Gender</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Deliveries (kgs)</th>
            <th className="p-2">Avatar</th>
          </tr>
        </thead>

        {!loading ? (
          <tbody>
            {farmers
              .filter((item) =>
                selectedFilter === "With Produce"
                  ? item.totalDeliveries > 0
                  : selectedFilter === "No Produce"
                  ? item.totalDeliveries === 0
                  : item
              )
              .map((item, index) => (
                <tr
                  key={index}
                  className={`border-b last:border-none text-center ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  {/* Checkbox for each row */}
                  {user && (
                    <td className="p-2">
                      <input
                        onChange={() => handleSelect(item.id.toString())}
                        checked={selectedFarmers.includes(item.id.toString())}
                        type="checkbox"
                        value={item.id}
                      />
                    </td>
                  )}
                  {/* Data cells */}
                  <td className="p-2 text-start">
                    <NavLink
                      to={`/home/farmers/${item.id}`}
                      className="hover:text-accent"
                    >
                      {item.firstName} {item.lastName}
                    </NavLink>
                  </td>
                  <td className="p-2 ">
                    {item.id > 100
                      ? item.id
                      : item.id < 10
                      ? `00${item.id}`
                      : `0${item.id}`}
                  </td>
                  <td className="p-2">M</td>
                  <td className="p-2 ">0{item.phone}</td>
                  <td className="p-2 ">{item.totalDeliveries}</td>
                  <td className="p-2 inline-flex justify-center">
                    {item.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={"data:image/png;base64," + item.avatar}
                        alt="farmer-avatar"
                      />
                    ) : (
                      <span className="bg-teal-700 rounded-full text-white h-8 w-8 flex items-center justify-center">
                        {item.firstName[0]}
                        {item.lastName[0]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        ) : null}
      </table>

      {!loading && farmers.length > 0 ? (
        <div className="flex justify-end items-center my-4">
          <div className="flex gap-2">
            {currentPage !== 1 && (
              <button
                onClick={prevPage}
                className="bg-white text-gray-600 hover:text-orange-500 font-semibold text-xs py-1 px-2 rounded inline-flex items-center gap-2"
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
                className="text-gray-600 hover:text-orange-500 font-semibold text-xs py-1 px-2 bg-white rounded inline-flex items-center gap-2"
              >
                <ArrowRight />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-2 py-[100px] w-full flex flex-col justify-center items-center">
          <Loader />
          <p className="text-gray-600">Loading.....</p>
        </div>
      ) : farmers.length === 0 ? (
        <div className="flex gap-3 flex-col justify-center items-center my-4">
          {/* Animate to emerge from the center as it enlearges */}
          <motion.div
            initial={{ width: "10px", height: "10px" }}
            animate={{ width: "auto", height: "auto" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <img
              src={errorImage}
              alt=""
              className="w-full h-[300px] flex-grow"
            />
          </motion.div>
          <p className="text-gray-600">Ooops! No farmers found</p>
          <button
            onClick={fetchFarmers}
            className="border border-gray-400 text-gray-500 hover:text-accent hover:border-accent rounded p-1 flex items-center gap-2"
          >
            Refresh
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* The export farmers modal */}
        <Modal
          isOpen={exportFarmerModal}
          onClose={() => setExportFarmerModal(false)}
        >
          <form onSubmit={handleSubmit}>
            {/* Custom file name */}
            <div>
              <p className="text-gray-700 font-medium my-3">Report Name</p>
              <input type="text" placeholder="Annual cherry report 2024" className="accent-orange-500" value={fileName} onChange={(e) => setFileName(e.target.value)}/>
            </div>
            {/* Format options */}
            <div>
              <p className="text-gray-700 font-medium my-3">Choose Format:</p>
              <div className="flex gap-3 flex-wrap">
                {["pdf", "csv", "excel"].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-3 rounded-lg shadow-sm cursor-pointer transition border w-full sm:w-auto ${
                      format === option
                        ? "bg-orange-100 border-orange-400"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={option}
                      checked={format === option}
                      onChange={() => setFormat(option)}
                      className="accent-orange-500"
                    />
                    {option.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            {/* Range selection */}
            <div>
              <p className="text-gray-700 font-medium my-3">Data Range:</p>
              <div className="flex gap-3 flex-wrap">
                <label
                  className={`flex items-center gap-2 p-3 rounded-lg shadow-sm cursor-pointer transition border w-full sm:w-auto ${
                    range === "all"
                      ? "bg-orange-100 border-orange-400"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="range"
                    value="all"
                    checked={range === "all"}
                    onChange={() => setRange("all")}
                    className="accent-orange-500"
                  />
                  All
                </label>
                <label
                  className={`flex items-center gap-2 p-3 rounded-lg shadow-sm cursor-pointer transition border w-full sm:w-auto ${
                    range === "from"
                      ? "bg-orange-100 border-orange-400"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="range"
                    value="from"
                    checked={range === "from"}
                    onChange={() => setRange("from")}
                    className="accent-orange-500"
                  />
                  Custom
                </label>
              </div>
              {range === "from" && (
                <div>
                  <p className="text-gray-700 font-medium my-3">From:</p>
                  <div className="flex justify-between items-center">
                    <input
                      type="number"
                      min="1"
                      value={startNumber}
                      onChange={(e) => setStartNumber(Number(e.target.value))}
                      placeholder="Enter starting number..."
                      className="mt-3 p-2 w-1/3 border rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />

                    <p className="text-lg">to</p>

                    <input
                      type="number"
                      max="350"
                      value={stopNumber}
                      onChange={(e) => setStopNumber(Number(e.target.value))}
                      placeholder="Enter stopping number..."
                      className="mt-3 p-2 w-1/3 border rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-2 mt-2">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition"
                onClick={() => setExportFarmerModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition"
              >
                Export
              </button>
            </div>
          </form>
        </Modal>
    </section>
  );
}
