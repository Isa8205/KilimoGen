import axios from 'axios';
import { Filter, Grid, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import Loader from './Widgets/Loaders/Loader1';

export function Inventory() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMembers = async () => {
      const response = await axios.get('http://localhost:3000/api/clerks');
      console.log(response.data.members);
      setMembers(response.data.members)
      setTimeout(() => setLoading(false), 3000)
    }

    fetchMembers();
  }, [])

  useEffect(() => {
    const form = document.querySelector('form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log(data);

      const response = await axios.post(
        'http://localhost:3000/api/add-clerk',
        data,
      );

      console.log(response);
    });
  }, []);

  return (
    <section className="text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Inventory</h2>

        <span className="inline-flex gap-2 text-sm font-semibold">
          <button className="bg-white text-black py-1 px-4 rounded">
            Export CSV
          </button>
          <button className="bg-accent text-white py-1 px-4 rounded">
            Add
          </button>
        </span>
      </div>

      <div className="bg-white p-5 flex shadow-md rounded-md">
        <span className="flex-grow border-x-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold">235</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold">235</span>
        </span>

        <span className="flex-grow border-e-2 border-gray-400 px-6">
          <p>Total</p>
          <span className="font-bold">235</span>
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
            <button className="hover:text-orange-500 p-1">
              <List className="text-xs" />
            </button>
            <button className="hover:text-orange-500 p-1">
              <Grid className="text-xs" />
            </button>
          </span>
          <button className="bg-white text-gray-600 hover:text-orange-500 font-semibold py-2 px-2 rounded inline-flex items-center gap-2">
            <Filter /> Filter
          </button>
        </span>
      </div>

      <table className="bg-white shadow-md rounded-md p-2 w-full table-auto border-collapse">
        <thead className="bg-gray-200 rounded-md p-2">
          <tr className='text-center'>
            {/* Checkbox header */}
            <th className=" p-2">
              <input type="checkbox" name="select-all" id="all" />
            </th>
            {/* Table headers */}
            <th className=" p-2">Name</th>
            <th className=" p-2">Farmer No.</th>
            <th className=" p-2">Email</th>
            <th className=" p-2">Gender</th>
            <th className=" p-2">Phone</th>
            <th className=" p-2">Deliveries (kgs)</th>
            <th className=" p-2">Status</th>
          </tr>
        </thead>

        {loading ? <Loader/> : (
          
        <tbody>
        {members.map((item: {firstName: string, lastName: string, id: number, email: string, gender: string, phone: number}, index) => (
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
            <td className="p-2 ">{item.firstName} {item.lastName}</td>
            <td className="p-2 ">{item.id}</td>
            <td className="p-2 ">{item.email}</td>
            <td className="p-2 ">{item.gender}</td>
            <td className="p-2 ">0{item.phone}</td>
            <td className="p-2 ">34,540</td>
            <td className="p-2 ">Active</td>
          </tr>
        ))}
      </tbody>
        )}
      </table>
    </section>
  );
}
