import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_BASE = import.meta.env.VITE_API_BASE_URL;

type Ticket = {
  id: string;
  statusId: number;
  categoryId: number;
  createdAt: string;
};

type TicketsResponse = {
  data: Ticket[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};

const ComplaintTypeMap: Record<number, string> = {
  0: "Job Complaint",
  1: "Payment Complaint",
  2: "Customer Complaint",
  3: "Worker Complaint",
};

const SupportStatusMap: Record<number, string> = {
  1: "Open",
  2: "In Progress",
  3: "Resolved",
  4: "Closed",
};

const TicketComplaints: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState(1);
  const [statusId, setStatusId] = useState(1);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async (opts?: { category?: number; status?: number; page?: number }) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const qCategory = opts?.category ?? categoryId;
      const qStatus = opts?.status ?? statusId;
      const qPage = opts?.page ?? pageNumber;

      const url = `${API_BASE}/customer-support/get-all-tickets?StatusId=${qStatus}&SupportCategory=${qCategory}&PageNumber=${qPage}&PageSize=10`;

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tickets");

      const data: TicketsResponse = await res.json();
      setTickets(data.data || []);
      setPageNumber(data.pageNumber);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      MySwal.fire("Error", err.message || "Failed to fetch tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    setPageNumber(1);
    fetchTickets({ category: categoryId, status: statusId, page: 1 });
  }, [categoryId, statusId]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageNumber(newPage);
    fetchTickets({ category: categoryId, status: statusId, page: newPage });
  };

 const handleViewDetails = (ticket: any) => {
  const created = new Date(ticket.createdAt).toLocaleString();

  MySwal.fire({
    title: "Ticket Details",
    html: `
      <div class="text-left space-y-2">
        <p><strong>Subject:</strong> ${ticket.subject ?? "-"}</p>
        <p><strong>Email:</strong> ${ticket.email ?? "-"}</p>
        <p><strong>Category:</strong> ${ComplaintTypeMap[ticket.categoryId]}</p>
        <p><strong>Status:</strong> ${SupportStatusMap[ticket.statusId]}</p>
        <p><strong>Created:</strong> ${created}</p>
        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
      </div>
    `,
    confirmButtonText: "Close",
  });
};


  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Ticket Complaints</h1>
          <p className="text-gray-600 mt-1">View and track your customer support tickets.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Category */}
            <div>
              <label className="text-sm text-gray-500 block mb-1">Filter by Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full rounded-lg border-gray-200 px-3 py-2"
              >
                {Object.entries(ComplaintTypeMap).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-500 block mb-1">Filter by Status</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(parseInt(e.target.value))}
                className="w-full rounded-lg border-gray-200 px-3 py-2"
              >
                {Object.entries(SupportStatusMap).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
          {loading ? (
            <div className="text-center py-20 text-gray-600">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No tickets found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100 text-left">
                    <th className="py-3 px-4 w-12">#</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket, i) => (
                    <tr key={ticket.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{(pageNumber - 1) * pageSize + i + 1}</td>
                      <td className="py-3 px-4">{ComplaintTypeMap[ticket.categoryId]}</td>
                      <td className="py-3 px-4">{SupportStatusMap[ticket.statusId]}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetails(ticket)}
                          className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm hover:bg-blue-100"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Page <strong>{pageNumber}</strong> of <strong>{totalPages}</strong>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={pageNumber === 1}
                    onClick={() => handlePageChange(pageNumber - 1)}
                    className="px-3 py-2 border rounded-lg bg-white text-sm disabled:opacity-40"
                  >
                    Prev
                  </button>

                  <button
                    disabled={pageNumber === totalPages}
                    onClick={() => handlePageChange(pageNumber + 1)}
                    className="px-3 py-2 border rounded-lg bg-white text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketComplaints;
