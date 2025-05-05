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
      
    }, [])
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

  const dropItems = [
    { label: "CSV", onClick: () => {} },
    { label: "Excel spredsheet", onClick: () => {} },
  ];

  return (
    <section className="text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Farmers</h2>

        {user && (
          <span className="inline-flex gap-2 text-sm font-semibold">
            <DropDown text="Export" dropItems={dropItems} />
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
                    <NavLink to={`/home/farmers/${item.id}`} className="hover:text-accent">
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
    </section>
  );
}
