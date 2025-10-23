import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const professions = [
  { id: 1, name: "Plumber" },
  { id: 2, name: "Electrician" },
  { id: 3, name: "Sweeper" },
  { id: 4, name: "Carpenter" },
  { id: 5, name: "Painter" },
  { id: 99, name: "Other" },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const BasePrice: React.FC = () => {
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleChange = (id: number, value: string) => {
    setPrices((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleSave = async (professionId: number) => {
    const basePrice = prices[professionId] || 0;
    setLoadingIds((prev) => [...prev, professionId]);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE}/AdminPrivileges/upsert-base-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "/",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ professionId, basePrice }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        MySwal.fire({
          icon: "success",
          title: "Base Price Updated!",
          text: `${professions.find((p) => p.id === professionId)?.name} base price saved successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.error || "Failed to update base price.");
      }
    } catch (err: any) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong.",
      });
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== professionId));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Set Base Prices</h1>

      <div className="bg-white shadow-md rounded-xl p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-3 px-4 text-left">Profession</th>
              <th className="py-3 px-4 text-left">Base Price (PKR)</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {professions.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{p.name}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    value={prices[p.id] ?? ""}
                    onChange={(e) => handleChange(p.id, e.target.value)}
                    placeholder="Enter base price"
                    className="border rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleSave(p.id)}
                    disabled={loadingIds.includes(p.id)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      loadingIds.includes(p.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {loadingIds.includes(p.id) ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasePrice;
