import { useEffect, useState } from 'react';
import { Plus, Calendar, Wheat, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import notify from './Widgets/ToastHelper';
import { NavLink } from 'react-router-dom';

// Interfaces
interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Harvest {
  id: string;
  seasonId: string;
  type: string;
  quantity: number;
  harvestDate: string;
}

export default function AdminPanel() {
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');

  // Temporary data for demonstration
  const demoSeasons: Season[] = [
    {
      id: '1',
      name: 'Winter 2023',
      startDate: '2023-11-01',
      endDate: '2024-02-28',
      description: 'Winter wheat and vegetable cultivation',
    },
  ];

  const demoHarvests: Harvest[] = [
    {
      id: '1',
      seasonId: '1',
      type: 'Wheat',
      quantity: 1500,
      harvestDate: '2024-02-15',
    },
  ];

  return (
    <div className="min-h-screen bg-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/home/dashboard">
            <h1 className="text-3xl font-bold text-teal-600">Kilimogen</h1>
          </NavLink>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSeasonModal(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
            >
              <Plus size={18} />
              Add Season
            </button>
            <button
              onClick={() => setShowHarvestModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"
            >
              <Plus size={18} />
              Add Harvest
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Seasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoSeasons.map((season) => (
            <SeasonCard
              key={season.id}
              season={season}
              harvests={demoHarvests.filter((h) => h.seasonId === season.id)}
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      {showSeasonModal && (
        <AddSeasonModal onClose={() => setShowSeasonModal(false)} />
      )}

      {showHarvestModal && (
        <AddHarvestModal
          seasons={demoSeasons}
          onClose={() => setShowHarvestModal(false)}
        />
      )}
    </div>
  );
}

// Season Card Component
function SeasonCard({
  season,
  harvests,
}: {
  season: Season;
  harvests: Harvest[];
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-teal-600 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-6 h-6" />
          <h2 className="text-xl font-semibold">{season.name}</h2>
        </div>
        <p className="text-sm opacity-90">{season.description}</p>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-teal-600">Harvests</h3>
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
            {harvests.length} records
          </span>
        </div>

        {harvests.map((harvest) => (
          <div
            key={harvest.id}
            className="flex items-center gap-3 mb-3 p-3 bg-teal-50 rounded-lg"
          >
            <Wheat className="w-5 h-5 text-teal-600" />
            <div>
              <p className="font-medium text-teal-900">{harvest.type}</p>
              <p className="text-sm text-gray-600">
                {harvest.quantity} kg · {harvest.harvestDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add Season Modal
function AddSeasonModal({ onClose }: { onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await axios.post(
        'http://localhost:3000/api/season/add',
        data,
      );

      notify(res.data.passed, res.data.message);
      e.currentTarget.reset;
    } catch (err) {
      console.error('Error submitting form: ', err);
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-teal-600">
            Add New Season
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season Name
            </label>
            <input
              type="text"
              name="seasonName"
              className="w-full px-4 py-2 border rounded-lg eal-500 focus:border-teal-500"
              placeholder="e.g., 2024/25"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="w-full px-4 py-2 border rounded-lg eal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                className="w-full px-4 py-2 border rounded-lg eal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season Target(kg)
            </label>
            <input
              type="number"
              name="target"
              className="w-full px-4 py-2 border rounded-lg eal-500 focus:border-teal-500"
              placeholder="e.g., 1000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              rows={3}
              name="description"
              className="w-full px-4 py-2 border rounded-lg eal-500"
              placeholder="Season notes..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              disabled={sending}
            >
              {sending ? 'Saving...' : 'Create Season'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Harvest Modal
function AddHarvestModal({
  onClose,
}: {
  seasons: Season[];
  onClose: () => void;
}) {
  const [seasons, setseasons] = useState<{ name: string; id: number }[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchSeasons = async () => {
      const res = await axios.get('http://localhost:3000/api/season');
      setseasons(res.data.seasons);
    };
    fetchSeasons();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await axios.post(
        'http://localhost:3000/api/harvest/add',
        data,
      );

      notify(res.data.passed, res.data.message);
    } catch (err) {
      console.error('Error submitting form: ', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-orange-600">
            Record New Harvest
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harvest Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg range-500"
              placeholder="eg. Harverst 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Season
            </label>
            <select
              name="season"
              required
              className="w-full px-4 py-2 border rounded-lg range-500"
            >
              <option value="">-----Select Season-----</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="w-full px-4 py-2 border rounded-lg range-500"
                placeholder="e.g., Wheat"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                className="w-full px-4 py-2 border rounded-lg range-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target
            </label>
            <input
              type="number"
              name="target"
              className="w-full px-4 py-2 border rounded-lg range-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              name="description"
              className="w-full px-4 py-2 border rounded-lg range-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              disabled={sending}
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {sending ? 'Saving...' : 'Record Harvest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
