import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Worker {
  id: string;
  name: string;
  statusId: number;
}

const WorkerCard = ({ worker }: { worker: Worker }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number>(worker.statusId);

  const handleApproval = async (action: number) => {
    try {
      let reason = "";
      let suspendDays = 0;

      if (action === 4) {
        const { value: inputReason } = await MySwal.fire({
          title: "Enter reason for rejection",
          input: "text",
          inputPlaceholder: "Reason...",
          showCancelButton: true,
        });
        if (!inputReason) return;
        reason = inputReason;
      }

      if (action === 1) {
        const { value: formValues } = await MySwal.fire({
          title: "Suspend Worker",
          html: `
            <input id="swal-reason" class="swal2-input" placeholder="Reason..." required>
            <input id="swal-days" type="number" class="swal2-input" placeholder="Days (9999 for permanent)" value="7" min="1" required>
          `,
          focusConfirm: false,
          showCancelButton: true,
          preConfirm: () => {
            const reasonInput = (document.getElementById("swal-reason") as HTMLInputElement)?.value;
            const daysInput = (document.getElementById("swal-days") as HTMLInputElement)?.value;
            
            if (!reasonInput || !daysInput) {
              MySwal.showValidationMessage("Please enter both reason and days");
              return;
            }
            return { reason: reasonInput, days: parseInt(daysInput) };
          },
        });

        if (!formValues) return;
        reason = formValues.reason;
        suspendDays = formValues.days;

        if (isNaN(suspendDays) || suspendDays <= 0) {
          await MySwal.fire("Error", "Suspension days must be greater than 0", "error");
          return;
        }
      }

      setLoading(true);

      const res = await api.post("/AdminPrivileges/approve-worker-profile", {
        id: worker.id,
        key: action,
        suspendDays,
        reason,
      });

      if (res.status === 200) {
        const messages = {
          3: ["Approved", "Worker approved successfully", "success"],
          4: ["Rejected", "Worker rejected successfully", "success"],
          1: ["Suspended", suspendDays >= 9999 ? "Worker suspended permanently" : `Worker suspended for ${suspendDays} days`, "warning"],
        };

        await MySwal.fire(messages[action as keyof typeof messages][0], messages[action as keyof typeof messages][1], messages[action as keyof typeof messages][2] as any);
        setStatus(action);
      }
    } catch (err) {
      console.error("Approval error:", err);
      await MySwal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{worker.name}</h3>
          <p className="text-gray-500 text-sm">ID: {worker.id}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          status === 1 ? "bg-yellow-100 text-yellow-800" :
          status === 2 ? "bg-blue-100 text-blue-800" :
          status === 3 ? "bg-green-100 text-green-800" :
          "bg-red-100 text-red-800"
        }`}>
          {status === 1 ? "Suspended" : status === 2 ? "Pending" : status === 3 ? "Verified" : "Rejected"}
        </span>
      </div>

      <Link
        to={`/workers/${worker.id}`}
        className="text-blue-600 text-sm hover:underline"
      >
        View Profile
      </Link>

      {status === 2 && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleApproval(3)}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleApproval(4)}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}

      {status === 3 && (
        <button
          onClick={() => handleApproval(1)}
          disabled={loading}
          className="w-full mt-3 px-3 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Suspend
        </button>
      )}
    </div>
  );
};

export default WorkerCard;