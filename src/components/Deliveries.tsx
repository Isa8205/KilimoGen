import { Filter, Grid, List, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Fuse, { FuseResult } from 'fuse.js';
import axios from 'axios';

export function Deliveries() {
  const data = [
    {
      farmer: 'Jane Doe',
      farmerNumber: 21,
      served_by: 'Kimani',
      product: 'Mbuni',
      quantity: 8000,
      date: '2024-2-1',
      harvest: 2,
      season: '2023/24',
    },
    {
      farmer: 'John Smith',
      farmerNumber: 42,
      served_by: 'Mwangi',
      product: 'Cherry',
      quantity: 100,
      date: '2024-11-15',
      harvest: 1,
      season: '2024/25',
    },
    {
      farmer: 'Mary Wanjiku',
      farmerNumber: 89,
      served_by: 'Kimani',
      product: 'Mbuni',
      quantity: 20,
      date: '2024-10-20',
      harvest: 3,
      season: '2024/25',
    },
    {
      farmer: 'Paul Kariuki',
      farmerNumber: 35,
      served_by: 'Mwangi',
      product: 'Mbuni',
      quantity: 150,
      date: '2024-10-20',
      harvest: 3,
      season: '2023/24',
    },
    {
      farmer: 'Grace Njeri',
      farmerNumber: 45,
      served_by: 'Kimani',
      product: 'Cherry',
      quantity: 6000,
      date: '2024-11-30',
      harvest: 1,
      season: '2022/23',
    },
    {
      farmer: 'Jane Doe',
      farmerNumber: 25,
      served_by: 'Kimani',
      product: 'Cherry',
      quantity: 75,
      date: '2024-11-15',
      harvest: 1,
      season: '2024/25',
    },
    {
      farmer: 'Michael Otieno',
      farmerNumber: 153,
      served_by: 'Mwangi',
      product: 'Mbuni',
      quantity: 3500,
      date: '2024-11-18',
      harvest: 2,
      season: '2024/25',
    },
    {
      farmer: 'Lucy Nyambura',
      farmerNumber: 78,
      served_by: 'Kimani',
      product: 'Cherry',
      quantity: 40,
      date: '2024-11-19',
      harvest: 1,
      season: '2023/24',
    },
    {
      farmer: 'John Smith',
      farmerNumber: 200,
      served_by: 'Mwangi',
      product: 'Mbuni',
      quantity: 1200,
      date: '2024-10-10',
      harvest: 3,
      season: '2024/25',
    },
    {
      farmer: 'Peter Kamau',
      farmerNumber: 33,
      served_by: 'Kimani',
      product: 'Cherry',
      quantity: 100,
      date: '2024-11-15',
      harvest: 1,
      season: '2024/25',
    },
    {
      farmer: 'Jane Doe',
      farmerNumber: 18,
      served_by: 'Kimani',
      product: 'Mbuni',
      quantity: 180,
      date: '2024-10-20',
      harvest: 3,
      season: '2023/24',
    },
    {
      farmer: 'Michael Otieno',
      farmerNumber: 95,
      served_by: 'Mwangi',
      product: 'Mbuni',
      quantity: 15,
      date: '2024-10-15',
      harvest: 3,
      season: '2023/24',
    },
    {
      farmer: 'John Smith',
      farmerNumber: 24,
      served_by: 'Kimani',
      product: 'Cherry',
      quantity: 600,
      date: '2024-11-15',
      harvest: 1,
      season: '2024/25',
    },
    {
      farmer: 'Grace Njeri',
      farmerNumber: 57,
      served_by: 'Kimani',
      product: 'Mbuni',
      quantity: 900,
      date: '2024-10-20',
      harvest: 3,
      season: '2023/24',
    },
    {
      farmer: 'Jane Doe',
      farmerNumber: 12,
      served_by: 'Mwangi',
      product: 'Mbuni',
      quantity: 27000,
      date: '2024-10-10',
      harvest: 3,
      season: '2024/25',
    },
    {
      farmer: 'Lucy Nyambura',
      farmerNumber: 24,
      served_by: 'Kimani',
      product: 'Cherry',
      quantity: 52000,
      date: '2024-11-15',
      harvest: 1,
      season: '2024/25',
    },
    {
      farmer: 'Paul Kariuki',
      farmerNumber: 67,
      served_by: 'Mwangi',
      product: 'Mbuni',
      quantity: 15,
      date: '2024-10-10',
      harvest: 3,
      season: '2021/22',
    },
    {
      farmer: 'Mary Wanjiku',
      farmerNumber: 59,
      served_by: 'Kimani',
      product: 'Mbuni',
      quantity: 25,
      date: '2024-10-20',
      harvest: 3,
      season: '2024/25',
    },
  ];

  // The search functionality
  const [query, setQuery] = useState('');
  const fuse = new Fuse(data, {
    keys: ['farmer', 'farmerNumber'],
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

  // Modal body and box
  const [modalDisp, setModalDisp] = useState(false);
  const Modal = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      await axios.post('http://localhost:3000/api/add-delivery', data)
      .then(res => {
        console.log(res.data.farmer)
        console.table(res.data.requestData)
      })
    };
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-md">
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
            <div className="grid gap-4">
              {/* Product Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="farmer-number"
                  className="text-right font-medium text-sm text-gray-700"
                >
                  Product
                </label>
                <input
                  id="farmer-number"
                  name="farmerNumber"
                  className="col-span-3 p-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-500"
                />
              </div>
              {/* Quantity Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="quantity"
                  className="text-right font-medium text-sm text-gray-700"
                >
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  name='quantity'
                  className="col-span-3 p-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-500"
                />
              </div>
              {/* Destination Input */}
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="destination"
                  className="text-right font-medium text-sm text-gray-700"
                >
                  Destination
                </label>
                <input
                  id="destination"
                  className="col-span-3 p-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-500"
                />
              </div> */}
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="border-t p-4 flex justify-end">
            <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300">
              Add Delivery
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <section className="text-gray-700">
      <div>
        {modalDisp && <Modal />}
        <h2 className="text-2xl font-bold mb-4">Deliveries</h2>

        <div className="bg-white text-gray-700 p-5 flex shadow-md rounded-md">
          <span className="flex-grow border-x-2 border-gray-400 px-6">
            <p>season</p>
            <span className="font-bold">2024/25</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Harvest</p>
            <span className="font-bold">235</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Total</p>
            <span className="font-bold">540, 000 kgs</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Today</p>
            <span className="font-bold">40, 000 kgs</span>
          </span>

          <span className="flex-grow border-e-2 border-gray-400 px-6">
            <p>Target</p>
            <span className="font-bold">40, 000 kgs</span>
          </span>
        </div>

        {/* <div className="mb-4 flex justify-between items-baseline">
          <div className="inline-flex gap-3 items-baseline">
            <span>
              <label htmlFor="season">Season</label>
              <br />
              <DropDown
                dropItems={seasonFilterItems}
                text={seasonFilter}
                styles="px-2 py-1 bg-gray-600 rounded-md"
              />
            </span>

            <span>
              <label htmlFor="season">Harvest</label>
              <br />
              <DropDown
                dropItems={harvestFilterItems}
                text={harvestFilter[0]}
                styles="px-2 py-1 bg-gray-600 rounded-md"
              />
            </span>
          </div>

          <span className="flex border-b-2 border-b-gray-400">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="eg. 123 or Jane Doe"
              className="bg-transparent p-1 text-white focus-visible:outline-none"
            />

            <button className="px-2">
              <Search className="text-gray-400" />
            </button>
          </span>
        </div> */}

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

          <span className="flex gap-4 items-center">
            <span className="bg-white text-gray-600 py-1 px-2 gap-2 rounded inline-flex">
              <button className="hover:text-orange-500 p-1">
                <List className="text-xs" />
              </button>
              <button className="hover:text-orange-500 p-1">
                <Grid className="text-xs" />
              </button>
            </span>
            <button
              className="bg-white text-gray-600 hover:text-orange-500 font-semibold py-2 px-2 rounded inline-flex items-center gap-2"
              onClick={() => setModalDisp(true)}
            >
              <Filter /> Filter
            </button>
          </span>
        </div>

        {/* <div className="flex justify-between items-center">
          <span className="inline-flex gap-2">
            <button className="flex gap-4 bg-teal-500 dark:bg-gray-600 text-white p-2 rounded-md">
              <FilterIcon />
              This month <ChevronDown />
            </button>
            <button
              className="flex bg-teal-500 dark:bg-gray-600 text-white p-2 rounded-md"
              onClick={() =>
                setSortType(
                  sortType === 'ascending' ? 'descending' : 'ascending',
                )
              }
            >
              {sortType === 'ascending' ? <ArrowDownAZIcon /> : <ArrowDownZA />}
            </button>
          </span>
          <button
            className="p-2 rounded-md bg-gray-200 text-black flex hover:bg-pink-500 hover:text-white"
            onClick={() => setModalDisp(true)}
          >
            <Plus /> Add a delivery
          </button>
        </div> */}

        <table className="bg-white shadow-md rounded-md  w-full table-auto border-collapse">
          <thead className="bg-gray-200 rounded-md p-2">
            <tr className="text-center">
              {/* Checkbox header */}
              <th className=" p-2">
                <input type="checkbox" name="select-all" id="all" />
              </th>
              {/* Table headers */}
              <th className=" p-2">Farmer</th>
              <th className=" p-2">Quantity (kgs)</th>
              <th className=" p-2">Cherry type</th>
              <th className=" p-2">Date</th>
              <th className=" p-2">Served by</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {deliveries
              // .sort((a, b) => {
              //   if (sortType === 'descending') {
              //     return b.date.toString().localeCompare(a.date.toString()); // Descending order
              //   } else {
              //     return a.date.toString().localeCompare(b.date.toString()); // Ascending order
              //   }
              // })
              .map((delivery, index) => (
                <tr
                  key={index}
                  className=" cursor-pointer last:border-none border-b-2"
                >
                  <td className=" p-2">
                    <input type="checkbox" name="select-all" id="all" />
                  </td>
                  <td className="py-3 text-center">{delivery.farmer}</td>
                  <td className="py-3 text-center">{delivery.quantity}</td>
                  <td className="py-3 text-center">{delivery.product}</td>
                  <td className="py-3 text-center">{delivery.date}</td>
                  <td className="py-3 text-center">{delivery.served_by}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
