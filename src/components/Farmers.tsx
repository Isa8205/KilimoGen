import axios from 'axios';
import { ArrowLeft, ArrowRight, Filter, Grid, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loader from './Widgets/Loaders/Loader1';
import { NavLink } from 'react-router-dom';

export function Farmers() {
  // Fetching farmers from the database
  const [farmers, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages));
  };
  useEffect(() => {
    const fetchMembers = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/farmer?page=${currentPage}&limit=${itemsPerPage}`,
      );
      setMembers(response.data.farmers);
      setTotalPages(response.data.totalPages);
      document.getElementById('totalFarmers')!.textContent =
        response.data.totalFarmers;
      setLoading(false);
    };

    fetchMembers();
  }, [currentPage]);

  return (
    <section className="text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Farmers</h2>

        <span className="inline-flex gap-2 text-sm font-semibold">
          <button className="bg-white text-black py-1 px-4 rounded">
            Export CSV
          </button>
          <NavLink to="/home/farmers/add">
            <button className="bg-accent text-white py-1 px-4 rounded">
              Add
            </button>
          </NavLink>
        </span>
      </div>

      <div className="bg-white p-5 flex shadow-md rounded-md">
        <span className="flex-grow border-x-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold" id="totalFarmers"></span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Active</p>
          <span className="font-bold">{farmers.length}</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Inactive</p>
          <span className="font-bold">0</span>
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
          <button className="bg-white text-gray-600 hover:text-orange-500 font-semibold py-2 px-2 rounded inline-flex items-center gap-2">
            <Filter /> Filter
          </button>
        </span>
      </div>

      <table
        className={`bg-white ${
          !loading ? 'shadow-md' : ''
        } rounded-md p-2 w-full table-auto border-collapse`}
      >
        <thead className="bg-gray-200 rounded-md">
          <tr className="text-center">
            {/* Checkbox header */}
            <th className=" p-2">
              <input type="checkbox" name="select-all" id="all" />
            </th>
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
            {farmers.map(
              (
                item: {
                  firstName: string;
                  lastName: string;
                  id: number;
                  gender: string;
                  phone: number;
                  avatar: string;
                  totalDeliveries: number;
                },
                index,
              ) => (
                <tr
                  key={index}
                  className={`border-b last:border-none text-center ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  {/* Checkbox for each row */}
                  <td className="p-2">
                    <input type="checkbox" value={item.id} />
                  </td>
                  {/* Data cells */}
                  <td className="p-2 ">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="p-2 ">
                    {item.id > 100 ? item.id : `00${item.id}`}
                  </td>
                  <td className="p-2 ">M</td>
                  <td className="p-2 ">0{item.phone}</td>
                  <td className="p-2 ">{item.totalDeliveries}</td>
                  <td className="p-2 inline-flex justify-center">
                    {item.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={item.avatar}
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
              ),
            )}
          </tbody>
        ) : null}
      </table>

      {farmers.length > 0 ? (
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
        <div className="mt-2 w-full flex flex-col justify-center items-center">
          <Loader />
          <p className="text-gray-600">Loading.....</p>
        </div>
      ) : null}
    </section>
  );
}
