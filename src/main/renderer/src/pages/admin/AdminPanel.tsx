import { useEffect, useState } from "react"
import {
  Plus,
  Calendar,
  Wheat,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  User,
  Package,
  Truck,
  MessageSquare,
  BarChart2,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { formatDate } from "date-fns"
import { OverviewCard } from "./OverviewCard" // Import OverviewCard component
import { AddSeasonModal } from "./AddSeasonModal" // Import AddSeasonModal component
import { AddHarvestModal } from "./AddHarvestModal" // Import AddHarvestModal component

// Interfaces
interface Harvest {
  id: number
  name: string
  target: number
  startDate: Date
  endDate: Date
  totalDeliveries: {
    overall: number
    mbuni: number
    cherry: number
  }
}

interface Season {
  id: number
  name: string
  startDate: string
  endDate: string
  description: string
  harvests: Harvest[]
}

interface Clerk {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  password: string
  phone: string
  avatar: string
}

export default function AdminPanel() {
  const [showSeasonModal, setShowSeasonModal] = useState(false)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [clerks, setClerks] = useState<Clerk[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)
  const [farmersCount, setFarmersCount] = useState(0)
  const [inventoryCount, setInventoryCount] = useState(0)
  const [deliveriesCount, setDeliveriesCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)
  const [productionCount, setProductionCount] = useState(0)

  // Season Card Component
  function SeasonCard({
    season,
  }: {
    season: Season
  }) {
    const [activeHarvestId, setActiveHarvestId] = useState<number | null>(null)
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="p-6 bg-primary text-white">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-semibold">{season.name}</h2>
          </div>
          <p className="text-sm opacity-90">{season.description}</p>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-primary">Harvests</h3>
            <button
              onClick={() => setSelectedSeasonId(season.id)}
              className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
            >
              Add
            </button>
          </div>

          {season.harvests.length > 0 ? (
            season.harvests.map((harvest) => (
              <div
                key={harvest.id}
                className="mb-3 p-4 bg-background rounded-lg border border-gray-100 hover:border-primary/20 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="inline-flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Wheat className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-medium text-primary">{harvest.name}</p>
                  </div>

                  <button
                    onClick={() =>
                      activeHarvestId === harvest.id ? setActiveHarvestId(null) : setActiveHarvestId(harvest.id)
                    }
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {activeHarvestId === harvest.id ? (
                      <ChevronDown size={18} className="text-secondary" />
                    ) : (
                      <ChevronRight size={18} className="text-secondary" />
                    )}
                  </button>
                </div>

                {activeHarvestId === harvest.id && (
                  <div className="mt-4 pl-10 text-sm">
                    <p className="font-medium text-primary mb-2">Status</p>
                    <ul className="space-y-1 text-secondary">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                        Start date: {formatDate(harvest.startDate, "dd-MMM-yyy")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                        End date: {formatDate(harvest.endDate, "dd-MMM-yyy")}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                        Target: {harvest.target.toLocaleString()} kg
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-secondary">
              <Wheat className="w-8 h-8 mx-auto mb-2 text-primary/30" />
              <p>No harvests recorded yet</p>
              <button
                onClick={() => setSelectedSeasonId(season.id)}
                className="mt-2 text-accent hover:underline text-sm"
              >
                Add your first harvest
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Backend fetching of data
  const fetchSeasons = async () => {
    try {
      const res = await window.electron.invoke("seasons:get-all")
      setSeasons(res.seasons)
    } catch (err) {
      console.error("Error fetching seasons: ", err)
    }
  }

  const fetchClerks = async () => {
    try {
      const clerks = await window.electron.invoke("get-clerks")
      setClerks(clerks)
    } catch (err) {
      console.error("Error fetching clerks: ", err)
    }
  }

  useEffect(() => {
    fetchSeasons()
    fetchClerks()
  }, [])

  useEffect(() => {
    // Fetch data counts (replace with actual API calls)
    setFarmersCount(120) // Example data
    setInventoryCount(45)
    setDeliveriesCount(30)
    setMessagesCount(15)
    setProductionCount(20)
  }, [])

  return (
    <div className="min-h-screen overflow-auto bg-background text-primary">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <NavLink to="/home/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Wheat className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Kilimogen Admin</h1>
          </NavLink>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-2xl font-bold mb-2 sm:mb-0">Dashboard Overview</h2>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              onClick={() => setShowSeasonModal(true)}
            >
              <Plus size={18} />
              <span>New Season</span>
            </button>
            <button
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
              onClick={() => (window.location.href = "/auth/clerk/register")}
            >
              <Plus size={18} />
              <span>New Clerk</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <OverviewCard
            title="Farmers"
            count={farmersCount}
            icon={<User className="w-6 h-6 text-white" />}
            link="/home/farmers"
            color="bg-primary"
          />
          <OverviewCard
            title="Inventory"
            count={inventoryCount}
            icon={<Package className="w-6 h-6 text-white" />}
            link="/home/inventory"
            color="bg-accent"
          />
          <OverviewCard
            title="Deliveries"
            count={deliveriesCount}
            icon={<Truck className="w-6 h-6 text-white" />}
            link="/home/deliveries"
            color="bg-primary"
          />
          <OverviewCard
            title="Messages"
            count={messagesCount}
            icon={<MessageSquare className="w-6 h-6 text-white" />}
            link="/home/messaging"
            color="bg-accent"
          />
          <OverviewCard
            title="Production"
            count={productionCount}
            icon={<BarChart2 className="w-6 h-6 text-white" />}
            link="/home/production"
            color="bg-primary"
          />
        </div>

        {/* Seasons Grid */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Seasons</h2>
            <button
              className="text-accent hover:text-accent/80 inline-flex items-center gap-2 transition-colors"
              onClick={() => setShowSeasonModal(true)}
            >
              <PlusCircle size={20} />
              <span className="font-medium">Add Season</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasons.length > 0 ? (
              seasons.map((season) => <SeasonCard key={season.id} season={season} />)
            ) : (
              <div className="col-span-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-medium text-primary mb-2">No Seasons Yet</h3>
                <p className="text-secondary mb-4">Create your first season to start tracking harvests</p>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  onClick={() => setShowSeasonModal(true)}
                >
                  <Plus size={18} />
                  <span>Add Season</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Display the clerks in tabular form */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Clerks</h2>
            <button
              className="text-accent hover:text-accent/80 inline-flex items-center gap-2 transition-colors"
              onClick={() => (window.location.href = "/auth/clerk/register")}
            >
              <PlusCircle size={20} />
              <span className="font-medium">Add Clerk</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-primary text-white text-left text-sm font-medium">Name</th>
                    <th className="px-6 py-3 bg-primary text-white text-left text-sm font-medium">Email</th>
                    <th className="px-6 py-3 bg-primary text-white text-left text-sm font-medium">Role</th>
                    <th className="px-6 py-3 bg-primary text-white text-left text-sm font-medium">Avatar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clerks.length > 0 ? (
                    clerks.map((clerk) => (
                      <tr key={clerk.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">
                            {clerk.firstName} {clerk.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-secondary">{clerk.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {clerk.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                            <img
                              className="w-full h-full object-cover"
                              src={`data:image/png;base64,${clerk.avatar}`}
                              alt={`${clerk.firstName} ${clerk.lastName}`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-secondary">
                        No clerks found. Add your first clerk to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showSeasonModal && <AddSeasonModal onClose={() => setShowSeasonModal(false)} />}

      {selectedSeasonId && <AddHarvestModal seasonId={selectedSeasonId} onClose={() => setSelectedSeasonId(null)} />}
    </div>
  )
}
