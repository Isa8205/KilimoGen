import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter,
  RefreshCcw,
  X,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import Fuse, { FuseResult } from "fuse.js";
import axios from "axios";
import notify from "../utils/ToastHelper";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loaders/Loader1";
import { useRecoilState } from "recoil";
import { sessionState, settingsState } from "@/store/store";
import { motion } from "framer-motion";
import errorImage from "@/assets/images/backgrounds/404_2.svg";
import Modal from "@/components/Modal/Modal";
import useClickOutside from "@/hooks/useClickOutside";
import { useQuery } from "@tanstack/react-query";

export function Deliveries() {
  // Copilot: Replace fetching state and fetchDeliveries with React Query
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const user = useRecoilState(sessionState)[0];
  const settings = useRecoilState(settingsState)[0];

  // Copilot: Use React Query for data fetching
  const {
    data: deliveriesData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["deliveries", currentPage, selectedFilter, settings.farm.currentHarvest, settings.farm.currentSeason],
    queryFn: async () => {
      return await window.electron.invoke('get-deliveries', {
        page: currentPage,
        limit: itemsPerPage,
        filter: selectedFilter,
        harvestName: settings.farm.currentHarvest,
        seasonName: settings.farm.currentSeason
      });
    },
    // Copilot: keepPreviousData is not supported in v5, so we omit it
  });

  // Copilot: Use React Query data
  const data = deliveriesData?.deliveries || [];
  const totalPages = deliveriesData?.totalPages || 1;
  const seasonTotal = deliveriesData?.totalWeight || 0;
  const todayTotal = deliveriesData?.todayWeight || 0;

  // Copilot: Search and selection logic remains the same
  const [query, setQuery] = useState("");
  const fuse = new Fuse(data, {
    keys: ["farmer.firstName", "farmer.lastName"],
    includeScore: true,
    includeMatches: true,
  });
  const results: FuseResult<any>[] = fuse.search(query);
  const searchResulsts = results
    .filter((result) => (result.score ?? Infinity) <= 0.3)
    .map((result) => result.item);
  const deliveries = query ? searchResulsts : data;
  const handleSearch = ({
    currentTarget,
  }: {
    currentTarget: EventTarget & { value?: string };
  }) => {
    const { value }: { value?: string } = currentTarget;
    setQuery(value as string);
  };

  // Functionality for selecting each delivery
  /**
   * A function to manage the selected delieries for other actions
   */
  // Individual farmer selection and all selection
  const [selectedDeliveries, setselectedDeliveries] = useState<string[]>([]);
  const handleSelect = (id: string) => {
    if (selectedDeliveries.includes(id)) {
      setselectedDeliveries(selectedDeliveries.filter((item) => item !== id));
    } else {
      setselectedDeliveries([...selectedDeliveries, id]);
    }
  };
  // Modal functionality
  const addDeliveryRef = useRef<HTMLDivElement>(null);
  useClickOutside(addDeliveryRef, () => {
    setModalDisp(false);
  });
  const [modalDisp, setModalDisp] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formObject = Object.fromEntries(formData as any);
      formObject.servedBy = user?.id;

      const data = { deliveryData: formObject, harvestName: settings.farm.currentHarvest, printerToUse: settings.printing.defaultReceiptPrinter };

      const res = await window.electron.invoke("add-delivery", data);

      notify(res.passed, res.message);
      if (res.passed) {
        setTimeout(() => {
          setModalDisp(false);
          refetch(); // Copilot: Use refetch from React Query
        }, 1500);
      }
    };
  

  // The component for the delivery filtering:
  const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const filters = ["All", "CHERRY", "MBUNI"];

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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg"
          >
            <ul className="py-2 text-gray-700">
              {filters.map((filter) => (
                <li
                  key={filter}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedFilter(filter);
                    setIsOpen(false);
                  }}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <section className="text-gray-700">
      <ToastContainer />
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Deliveries</h2>

          {user && (
            <button
              onClick={() => setModalDisp(true)}
              className="bg-accent text-white py-1 px-4 rounded"
            >
              Add
            </button>
          )}
        </div>

        <div className="bg-white text-gray-700 p-5 flex shadow-md rounded-md">
          <span className="flex-grow border-x-2 border-gray-400 px-6">
            <p>season</p>
            <span className="font-bold">{settings.farm.currentSeason}</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Harvest</p>
            <span className="font-bold">{settings.farm.currentHarvest}</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Season Total</p>
            <span className="font-bold">
              {seasonTotal} kgs
            </span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Today's Total</p>
            <span className="font-bold">{todayTotal} kgs</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Target</p>
            <span className="font-bold">40, 000 kgs</span>
          </span>
        </div>

        <div className="flex justify-between my-4">
          <input
            type="text"
            name="search"
            id="search"
            value={query}
            onChange={handleSearch}
            placeholder="eg. 123 or Jane Doe"
            className="bg-white px-4 py-1 rounded-md shadow-md text-gray-600 focus-visible:outline-none"
          />

          <FilterDropdown />
        </div>

        {/* Display the number of people selected */}
        {selectedDeliveries.length > 0 && (
          <div>
            <span className="text-sm font-semibold">
              {selectedDeliveries.length} selected
            </span>
          </div>
        )}

        <table className="bg-white shadow-md rounded-md  w-full table-auto border-collapse">
          <thead className="bg-gray-200 rounded-md p-2">
            <tr className="text-center">
              {/* Table headers */}
              <th className=" p-2">Farmer</th>
              <th className=" p-2">Quantity (kgs)</th>
              <th className=" p-2">Berry type</th>
              <th className=" p-2">Date</th>
              <th className=" p-2">Served by</th>
            </tr>
          </thead>

          {!isLoading && (
            <tbody className="text-center">
              {deliveries.map((delivery: any, index: number) => (
                <tr
                  key={index}
                  className="even:bg-gray-50 last:border-none border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 text-center">
                    {delivery.farmer.firstName + " " + delivery.farmer.lastName}
                  </td>
                  <td className="py-3 text-center">{delivery.quantity}</td>
                  <td className="py-3 text-center">{delivery.berryType}</td>
                  <td className="py-3 text-center">
                    {delivery.deliveryDate
                      .slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")}
                  </td>
                  <td className="py-3 text-center">
                    {delivery.servedBy.firstName +
                      " " +
                      delivery.servedBy.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {/* Copilot: Use isLoading for loader */}
        {isLoading ? (
          <div className="mt-2 py-[100px] w-full flex flex-col justify-center items-center">
            <Loader />
            <p className="text-gray-600">Loading.....</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="flex gap-3 flex-col justify-center items-center my-4">
            {" "}
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
            <p className="text-gray-600">Ooops! No deliveries found</p>
            <button
              onClick={() => refetch()} // Copilot: Use refetch from React Query
              className="border border-gray-400 text-gray-500 hover:text-accent hover:border-accent rounded p-1 flex items-center gap-2"
            >
              Refresh
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>

      <Modal
        ref={addDeliveryRef}
        title="Add Delivery"
        isOpen={modalDisp}
        onClose={() => setModalDisp(false)}
        >
        <form
          onSubmit={handleSubmit}
          className=""
        >
          <ToastContainer/>
          {/* Dialog Content */}
          <div className="p-4">
            <div className="flex flex-col gap-2 justify-between">
                {/* FarmerNumber Input */}
                <div className="my-2">
                  <label
                    htmlFor="farmer-number"
                    className="block font-medium text-sm text-gray-700"
                  >
                    Farmer Number
                  </label>
                  <input
                    min="1"
                    required
                    type="number"
                    id="farmer-number"
                    name="farmerNumber"
                    className="w-full p-2 border rounded-md focus:outline-none "
                  />
                </div>
                {/* BerryType Input */}
                <div className="my-2">
                  <label
                    htmlFor="berryType"
                    className="text-right font-medium text-sm text-gray-700"
                  >
                    Berry Type
                  </label>
                  <select
                    name="berryType"
                    id="berryType"
                    className="w-full p-2 border rounded-md focus:outline-none"
                  >
                    <option value="CHERRY">CHERRY</option>
                    <option value="MBUNI">MBUNI</option>
                  </select>
                </div>

              {/* Quantity Input */}
              <div className="my-2">
                <label
                  htmlFor="quantity"
                  className="text-right font-medium text-sm text-gray-700"
                >
                  Quantity
                </label>
                <input
                  min="1"
                  required
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none "
                />
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={() => setModalDisp(false)} className="text-white bg-gray-500 hover:bg-gray-600 text-sm py-2 px-4 rounded-md mr-2">
              Cancel
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md">
              Add Delivery
            </button>
          </div>
        </form>
        </Modal>
    </section>
  );
}
