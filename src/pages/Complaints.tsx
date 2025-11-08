import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Complaint {
  jobId: string;
  complaintId: string;
  complaintDescription: string;
  attachmentUrl: string;
  customerName: string;
  workerName: string;
  jobTitle: string;
  complaintStatus: string;
  complaintDate: string;
}

const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE}/job-complaints/get-all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data?.data && Array.isArray(data.data)) {
        setComplaints(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to fetch complaints.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [pageNumber, pageSize]);

  // Approve complaint
  const handleApprove = async (complaintId: string) => {
    const { value: adminRemarks } = await MySwal.fire({
      title: "Approve Complaint?",
      input: "textarea",
      inputLabel: "Admin Remarks (optional)",
      inputPlaceholder: "Write remarks here...",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    });

    if (adminRemarks === undefined) return; // cancelled

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/job-complaints/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintId,
          approve: true,
          adminRemarks,
        }),
      });

      const data = await res.json();

      if (data?.isSuccess) {
        MySwal.fire({
          icon: "success",
          title: "Approved",
          text: data.message || "Complaint approved successfully.",
        });
        fetchComplaints(); // Refresh the table
      } else {
        throw new Error(data?.message || "Approval failed.");
      }
    } catch (err: any) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Job Complaints</h1>

      <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
        {complaints.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No complaints found.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Attachment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Complaint Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.complaintId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{c.complaintId}</td>
                  <td className="py-3 px-4">{c.jobId}</td>
                  <td className="py-3 px-4">{c.jobTitle}</td>
                  <td className="py-3 px-4">{c.customerName}</td>
                  <td className="py-3 px-4">{c.workerName}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {c.complaintDescription || "—"}
                  </td>
                  <td className="py-3 px-4">
                    {c.attachmentUrl && c.attachmentUrl.startsWith("http") ? (
                      <a
                        href={c.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">No File</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        c.complaintStatus === "Approved"
                          ? "bg-green-100 text-green-700"
                          : c.complaintStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : c.complaintStatus === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.complaintStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(c.complaintDate).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {c.complaintStatus === "Pending" && (
                      <button
                        onClick={() => handleApprove(c.complaintId)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber === 1}
            className={`px-4 py-2 rounded-lg text-white ${
              pageNumber === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">Page {pageNumber}</span>
          <button
            onClick={() => setPageNumber((p) => p + 1)}
            className="px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
