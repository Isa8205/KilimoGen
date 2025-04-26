import OnlyAdmin from "@/components/auth/OnlyAdmin";
import useClickOutside from "@/hooks/useClickOutside";
import getFarmer from "@/services/fetchFarmer";
import humanReadableDate from "@/utils/DateFormatter";
import { AtSign, Phone, User, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// ---------------- FLEX TAPE: TYPES ------------------

type Delivery = {
  id: number;
  deliveryDate: string;
  quantity: number;
  berryType: string;
  servedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  } | string;
};

type Advance = {
  id: number;
  dateGiven: string;
  dateExpected: string;
  amount: number;
  reason: string;
  status: "Paid" | "Pending" | "Overdue";
};

type Farmer = {
  id: number;
  farmerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  deliveries: Delivery[];
  advances: Advance[];
};

// ---------------- FLEX TAPE: COMPONENT ------------------

const FarmerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"deliveries" | "advances">("deliveries");
  const [editDelivery, setEditDelivery] = useState<Partial<Delivery> | null>(null);
  const [farmerInfo, setFarmerInfo] = useState<Farmer | null>(null);

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setEditDelivery(null));

  useEffect(() => {
    (async () => {
      if (!params.id) return;
      const id = Number(params.id);
      const data = await getFarmer(id);
      console.log(data);
      if (data) setFarmerInfo(data);
    })();
  }, [params.id]);

  const deliveries = farmerInfo?.deliveries || [];
  const advances = farmerInfo?.advances || [];

  return (
    <div className="min-h-full bg-background text-gray-700 p-6 relative">
      {/* Navigation */}
      <div className="mb-5 flex space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-secondary text-white rounded hover:bg-opacity-90 transition"
        >
          ← Back
        </button>
        <Link
          to="/home/farmers"
          className="px-3 py-1 bg-accent text-white rounded hover:bg-opacity-90 transition"
        >
          All Farmers
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        {farmerInfo?.avatar ? (
          <img
            src={`data:image/png;base64,${farmerInfo.avatar}`}
            alt="Avatar"
            className="h-24 w-24 rounded-full object-cover ring-4 ring-accent"
          />
        ) : (
          <span className="h-24 w-24 flex items-center justify-center rounded-full bg-secondary text-3xl font-bold text-white ring-4 ring-accent">
            {farmerInfo?.firstName?.[0]}
            {farmerInfo?.lastName?.[0]}
          </span>
        )}
        <div>
          <h1 className="text-3xl font-extrabold text-primary">
            {farmerInfo?.firstName} {farmerInfo?.lastName}
          </h1>
          <p className="flex gap-2 mt-1 text-secondary font-semibold">
            <User className="text-accent" /> Farmer No: {farmerInfo?.farmerNumber}
          </p>
          <p className="flex gap-2 mt-1 text-secondary font-semibold">
            <AtSign className="text-accent" /> Email: {farmerInfo?.email}
          </p>
          <p className="flex gap-2 mt-1 text-secondary font-semibold">
            <Phone className="text-accent" /> Phone: 0{farmerInfo?.phone}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-secondary mb-6">
        {(["deliveries", "advances"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-medium transition ${
              activeTab === tab
                ? "border-b-4 border-accent text-primary"
                : "text-secondary hover:bg-gray-100"
            }`}
          >
            {tab === "deliveries" ? "Deliveries" : "Advances"}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "deliveries" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-primary">Delivery Records</h2>
            <button className="px-4 py-2 bg-accent text-white font-medium rounded shadow hover:bg-opacity-90 transition">
              + Add Delivery
            </button>
          </div>

          {deliveries.length ? (
            <table className="w-full divide-y divide-secondary">
              <thead className="bg-secondary bg-opacity-10">
                <tr>
                  {["Date", "Quantity", "Grade", "Served By", <OnlyAdmin key="edit"><span>Edit</span></OnlyAdmin>].map((h, i) => (
                    <th key={i} className="px-4 py-2 text-left text-secondary font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {deliveries.map((d, idx) => (
                  <tr key={idx} className="hover:bg-background transition">
                    <td className="px-4 py-3">{d.deliveryDate.slice(0, 10)}</td>
                    <td className="px-4 py-3">{d.quantity}</td>
                    <td className="px-4 py-3">{d.berryType}</td>
                    <td className="px-4 py-3">
                      {typeof d.servedBy === "string"
                        ? d.servedBy
                        : d.servedBy
                        ? `${d.servedBy.firstName} ${d.servedBy.lastName}`
                        : "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-accent hover:underline"
                        onClick={() => setEditDelivery(d)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-secondary italic">No deliveries yet.</p>
          )}
        </div>
      )}

      {activeTab === "advances" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-primary">Advance Payments</h2>
            <button className="px-4 py-2 bg-accent text-white font-medium rounded shadow hover:bg-opacity-90 transition">
              + Add Advance
            </button>
          </div>

          {advances.length ? (
            <table className="w-full divide-y divide-secondary">
              <thead className="bg-secondary bg-opacity-10">
                <tr>
                  {["Given", "Due", "Amount", "Reason", "Status", "Edit"].map((h, i) => (
                    <th key={i} className="px-4 py-2 text-left text-secondary font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {advances.map((a, idx) => (
                  <tr key={idx} className="hover:bg-background transition">
                    <td className="px-4 py-3">{a.dateGiven}</td>
                    <td className="px-4 py-3">{a.dateExpected}</td>
                    <td className="px-4 py-3">Ksh {a.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{a.reason}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
                          a.status === "Paid"
                            ? "bg-primary bg-opacity-20 text-primary"
                            : a.status === "Pending"
                            ? "bg-accent bg-opacity-20 text-accent"
                            : "bg-secondary bg-opacity-20 text-secondary"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-accent hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-secondary italic">No advances yet.</p>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setEditDelivery(null)}
              className="absolute top-4 right-4 text-secondary hover:text-primary transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-semibold text-primary mb-4">
              Edit Delivery
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Saving:", editDelivery);
                setEditDelivery(null);
              }}
            >
              <label className="block mb-2 text-secondary font-medium">Product</label>
              <input
                type="text"
                className="w-full border border-secondary px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
                value={editDelivery.berryType ?? ""}
                onChange={(e) =>
                  setEditDelivery({ ...editDelivery, berryType: e.target.value })
                }
              />

              <label className="block mb-2 text-secondary font-medium">Quantity</label>
              <input
                type="number"
                className="w-full border border-secondary px-3 py-2 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-accent"
                value={editDelivery.quantity ?? ""}
                onChange={(e) =>
                  setEditDelivery({ ...editDelivery, quantity: +e.target.value })
                }
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditDelivery(null)}
                  className="px-4 py-2 border border-secondary rounded hover:bg-secondary hover:bg-opacity-10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;
