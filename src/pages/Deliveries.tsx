import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter,
  RefreshCcw,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Fuse, { FuseResult } from 'fuse.js';
import axios from 'axios';
import notify from './Widgets/ToastHelper';
import { ToastContainer } from 'react-toastify';
import Loader from './Widgets/Loaders/Loader1';
import { useRecoilState } from 'recoil';
import { sessionState } from '@/store/store';
import { motion } from 'framer-motion';
import errorImage from '@/assets/images/backgrounds/404_2.svg';

export function Deliveries() {
  // Get the session data
  const user = useRecoilState(sessionState)[0];
  // Get the data from the server
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<
    { id: number; farmer: string; farmerNumber: string }[]
  >([]);
  const [fetching, setfetching] = useState(true);

  // Function to fetch deliveries data
  const [selectedFilter, setSelectedFilter] = useState('All');
  const fetchDeliveries = async () => {
    setfetching(true); // Set loading state
    try {
      const response = await axios.get(
        `http://localhost:3000/api/delivery?page=${currentPage}&limit=${itemsPerPage}&filter=${selectedFilter}`,
      );
      setData(response.data.deliveries);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setfetching(false); // Turn off loading
    }
  };

  // Page navigation
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDeliveries();
  }, [currentPage, selectedFilter]);

  // The search functionality
  const [query, setQuery] = useState('');
  const fuse = new Fuse(data, {
    keys: ['farmer.firstName', 'farmer.lastName'],
    includeScore: true,
    includeMatches: true,
  });
  const results: FuseResult<any>[] = fuse.search(query);
  const searchResulsts = results
    .filter((result) => (result.score ?? Infinity) <= 0.3)
    .map((result) => result.item);

  // Set the data to be displayed
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

  const handleselectall = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (checked) {
      setselectedDeliveries(
        deliveries.map((delivery) => delivery.id.toString()),
      );
    } else {
      setselectedDeliveries([]);
    }
  };

  // Modal body and box
  const [modalDisp, setModalDisp] = useState(false);
  const Modal = () => {
    const user = useRecoilState(sessionState)[0];
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      await axios
        .post(
          `http://localhost:3000/api/delivery/add?clerkId=${user?.id}`,
          data,
        )
        .then((res) => {
          console.log(res);
          notify(res.data.passed, res.data.message);
          res.data.passed
            ? setTimeout(() => {
                setModalDisp(false);
                fetchDeliveries();
              }, 1500)
            : null;
        });
    };
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black z-50">
        <ToastContainer />
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg w-full max-w-md"
        >
          {/* Dialog Header */}
          <div className="border-b p-4">
            <span className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add New Delivery</h2>
              <X
                className="bg-gray-100 cursor-pointer hover:bg-red-500 hover:text-white rounded-sm"
                onClick={() => setModalDisp(false)}
              />
            </span>
            <p className="text-sm text-gray-600">
              Enter the details for the new delivery.
            </p>
          </div>

          {/* Dialog Content */}
          <div className="p-4">
            <div className="flex flex-col gap-2 justify-between">
              <div className="flex justify-between">
                {/* FarmerNumber Input */}
                <div className="">
                  <label
                    htmlFor="farmer-number"
                    className="text-right font-medium text-sm text-gray-700"
                  >
                    Farmer Number
                  </label>
                  <input
                    min="1"
                    required
                    type="number"
                    id="farmer-number"
                    name="farmerNumber"
                    className="col-span-3 p-2 border rounded-md focus:outline-none "
                  />
                </div>
                {/* BerryType Input */}
                <div className="">
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
              </div>

              {/* Quantity Input */}
              <div className="flex flex-col items-start">
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
                  className="col-span-3 p-2 border rounded-md focus:outline-none "
                />
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="border-t p-4 flex justify-end">
            <button className="bg-gray-100 text-gray-600 border-2 border-accent hover:text-white py-2 px-4 rounded-md hover:bg-accent focus:outline-none">
              Add Delivery
            </button>
          </div>
        </form>
      </div>
    );
  };

  // The component for the delivery filtering:
  const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const filters = ['All', 'CHERRY', 'MBUNI'];

    return (
      <div className="relative inline-block text-left z-10">
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
            className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10"
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
        {modalDisp && <Modal />}
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
            <span className="font-bold">2024/25</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Harvest</p>
            <span className="font-bold">1</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Season Total</p>
            <span className="font-bold">
              {deliveries.reduce((acc, delivery) => acc + delivery.quantity, 0)}{' '}
              kgs
            </span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Today's Total</p>
            <span className="font-bold">  kgs
            </span>
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
              {/* Checkbox header */}
              <th className=" p-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleselectall(e)}
                  checked={
                    deliveries.length > 0 &&
                    selectedDeliveries.length === deliveries.length
                  }
                  name="select-all"
                  id="all"
                />
              </th>
              {/* Table headers */}
              <th className=" p-2">Farmer</th>
              <th className=" p-2">Quantity (kgs)</th>
              <th className=" p-2">Berry type</th>
              <th className=" p-2">Date</th>
              <th className=" p-2">Served by</th>
            </tr>
          </thead>

          {!fetching && (
            <tbody className="text-center">
              {deliveries.map((delivery, index) => (
                <tr
                  key={index}
                  className="even:bg-gray-50 last:border-none border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className=" p-2">
                    <input
                      type="checkbox"
                      onChange={() => handleSelect(delivery.id.toString())}
                      checked={selectedDeliveries.includes(
                        delivery.id.toString(),
                      )}
                      id="all"
                    />
                  </td>
                  <td className="py-3 text-center">
                    {delivery.farmer.firstName + ' ' + delivery.farmer.lastName}
                  </td>
                  <td className="py-3 text-center">{delivery.quantity}</td>
                  <td className="py-3 text-center">{delivery.berryType}</td>
                  <td className="py-3 text-center">
                    {delivery.deliveryDate
                      .slice(0, 10)
                      .split('-')
                      .reverse()
                      .join('-')}
                  </td>
                  <td className="py-3 text-center">
                    {delivery.servedBy.firstName +
                      ' ' +
                      delivery.servedBy.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {deliveries.length > 0 ? (
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

        {fetching ? (
          <div className="mt-2 py-[100px] w-full flex flex-col justify-center items-center">
            <Loader />
            <p className="text-gray-600">Loading.....</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="flex gap-3 flex-col justify-center items-center my-4">
            {' '}
            {/* Animate to emerge from the center as it enlearges */}
            <motion.div
              initial={{ width: '10px', height: '10px' }}
              animate={{ width: 'auto', height: 'auto' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <img
                src={errorImage}
                alt=""
                className="w-full h-[300px] flex-grow"
              />
            </motion.div>
            <p className="text-gray-600">Ooops! No deliveries found</p>
            <button
              onClick={fetchDeliveries}
              className="border border-gray-400 text-gray-500 hover:text-accent hover:border-accent rounded p-1 flex items-center gap-2"
            >
              Refresh
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
