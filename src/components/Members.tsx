import axios from 'axios';
import { Filter, Grid, List } from 'lucide-react';
import { useEffect } from 'react';

export function Members() {
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
        <h2 className="text-2xl font-bold">Members</h2>

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

      <div className="bg-white shadow-md rounded-md p-4">
        <span className="flex">
          <span className="bg-gray-200 rounded-l-md p-2">
            <input type="checkbox" name="all" id="all" />
          </span>
          <ul className="list-style-none flex flex-grow justify-between bg-gray-200 p-2 rounded-r-md">
            <li>Name</li>
            <li>Email</li>
            <li>Gender</li>
            <li>Phone</li>
            <li>Status</li>
          </ul>
        </span>
      </div>
    </section>
  );
}