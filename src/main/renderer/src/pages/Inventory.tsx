import axios from 'axios';
import { Edit, Grid, List, MoreHorizontal, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loader from '../components/Loaders/Loader1';
import { NavLink } from 'react-router-dom';
import Tooltip from '../components/Tooltips/Tooltip';
import { motion } from 'framer-motion';
import errorImage from '@/assets/images/backgrounds/404_2.svg';
import { useRecoilState } from 'recoil';
import { sessionState } from '@/store/store';

export function Inventory() {
  // Get the session data
  const user = useRecoilState(sessionState)[0];

  // States for the display either grid or table
  const [gridDisplay, setGridDisplay] = useState(true);

  // Data state for storing after api fetching
  const [items, setItems] = useState<
    {
      id: number;
      productName: string;
      category: string;
      quantity: number;
      weight: string;
      dateReceived: string;
      receivedBy: {
        firstName: string;
        lastName: string;
      };
      image: string;
    }[]
  >([]);
  const [fetching, setFetching] = useState(false);

  // Function to fetch deliveries data
  const fetchInventory = async () => {
    setFetching(true); // Set fetching state
    try {
      const response = await window.electron.invoke('get-inventory');
      setItems(response.items);
      console.log(response.items);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <section className="text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Inventory</h2>

        {user && (
          <span className="inline-flex gap-2 text-sm font-semibold">
            <button className="bg-white text-black py-1 px-4 rounded">
              {/* // TODO: Add export function */}
              Export CSV
            </button>
            <NavLink to="/home/inventory/add">
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
          <span className="font-bold">{items.length}</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold">{items.length}</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold">{items.length}</span>
        </span>
      </div>

      <div className="flex justify-between my-4">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="search"
          className="bg-white px-4 py-1 rounded-md shadow-md text-gray-600"
        />

        <span className="flex gap-4 items-center">
          <span className="bg-white text-gray-600 py-1 px-2 gap-2 rounded inline-flex">
            <Tooltip text="List" className="" position="bottom">
              <button
                className="hover:text-orange-500 p-1"
                onClick={() => setGridDisplay(!gridDisplay)}
              >
                <List
                  className={`${!gridDisplay ? 'text-orange-500' : ''} text-xs`}
                />
              </button>
            </Tooltip>
            <Tooltip text="Grid" className="" position="bottom">
              <button
                className="hover:text-orange-500 p-1"
                onClick={() => setGridDisplay(!gridDisplay)}
              >
                <Grid
                  className={`${gridDisplay ? 'text-orange-500' : ''} text-xs`}
                />
              </button>
            </Tooltip>
          </span>
        </span>
      </div>

      {!gridDisplay && (
        <table
          className={`bg-white rounded-md p-2 w-full table-auto border-collapse`}
        >
          <thead className="bg-gray-200 rounded-md">
            <tr className="text-center">
              {/* Checkbox header */}
              <th className=" p-2">
                <input type="checkbox" name="select-all" id="all" />
              </th>
              {/* Table headers */}
              <th className=" p-2">Item</th>
              <th className=" p-2">Category</th>
              <th className=" p-2">Quantity</th>
              <th className=" p-2">Weight/Volume</th>
              <th className=" p-2">Received on</th>
              <th className=" p-2">Received by</th>
              <th className=" p-2">Image</th>
            </tr>
          </thead>

          {!fetching && (
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b last:border-none text-center ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  {/* Checkbox for each row */}
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  {/* Data cells */}
                  <td className="p-2 ">{item.productName}</td>
                  <td className="p-2 ">{item.category}</td>
                  <td className="p-2 ">{item.quantity}</td>
                  <td className="p-2 ">{item.weight}</td>
                  <td className="p-2 ">
                    {item.dateReceived.toLocaleDateString()}
                  </td>
                  <td className="p-2 ">
                    {item.receivedBy.firstName} {item.receivedBy.lastName}
                  </td>
                  <td className="p-2 inline-flex justify-center ">
                    <div className="w-[4em] h-[4em] bg-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:opacity-75">
                      {' '}
                      {item.image ? (
                        <img
                          src={`data:image/png;base64,${item.image}`}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-t-md"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">No Image</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      )}

      {!fetching && gridDisplay ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {items.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg shadow-md overflow-hidden ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              {/* Image at the top */}
              <div className="w-full h-[10em] bg-gray-300 rounded-t-md flex items-center justify-center cursor-pointer hover:opacity-75">
                {' '}
                {item.image ? (
                  <img
                    src={`data:image/png;base64,${item.image}`}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-t-md"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              {/* Card content */}
              <div className="p-4">
                {/* Checkbox */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {item.dateReceived.toLocaleDateString()}
                  </span>
                  <Tooltip text="Edit" className="" position="bottom">
                    <button className="hover:text-orange-500">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
                {/* Data fields */}
                <h2 className="text-lg font-semibold text-gray-600">
                  {item.productName}
                </h2>
                <p className="text-sm text-gray-600">
                  Category: {item.category}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-600">Weight: {item.weight}</p>
                <p className="text-sm text-gray-600">
                  Received By: {item.receivedBy.firstName}{' '}
                  {item.receivedBy.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {fetching ? (
        <div className="mt-2 py-[100px] w-full flex flex-col justify-center items-center">
          <Loader />
          <p className="text-gray-600">Loading.....</p>
        </div>
      ) : items.length === 0 ? (
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
          <p className="text-gray-600">Ooops! No items found</p>
          <button
            onClick={fetchInventory}
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
