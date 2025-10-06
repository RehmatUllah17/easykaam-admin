import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const WorkerCard = ({ worker }: { worker: any }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number>(worker.statusId);

  const handleApproval = async (key: number) => {
    try {
      let reason = "";
      let suspendDays = 0;
      // Reject Worker
      if (key === 4) {
        const { value: inputReason } = await MySwal.fire({
          title: <p>Enter reason for rejection</p>,
          input: "text",
          inputPlaceholder: "Reason...",
          showCancelButton: true,
        });
        if (!inputReason) return; 
        reason = inputReason;
      }

      // Suspend Worker
      if (key === 1) {
        const { value: formValues } = await MySwal.fire({
          title: <p>Suspend Worker</p>,
          html: (
            <div className="flex flex-col gap-2">
              <input
                id="swal-reason"
                className="swal2-input"
                placeholder="Reason..."
              />
              <input
                id="swal-days"
                type="number"
                className="swal2-input"
                placeholder="Days (9999 for permanent)"
                defaultValue={7}
                min={1}
              />
            </div>
          ),
          focusConfirm: false,
          showCancelButton: true,
          preConfirm: () => {
            const reasonInput = (
              document.getElementById("swal-reason") as HTMLInputElement
            )?.value;
            const daysInput = (
              document.getElementById("swal-days") as HTMLInputElement
            )?.value;
            if (!reasonInput || !daysInput) {
              MySwal.showValidationMessage("Please enter both reason and days");
              return;
            }
            return {
              reason: reasonInput,
              days: parseInt(daysInput, 10),
            };
          },
        });

        if (!formValues) return; 
        reason = formValues.reason;
        suspendDays = formValues.days;

        if (isNaN(suspendDays) || suspendDays <= 0) {
          await MySwal.fire(
            "Error",
            "Suspension days must be greater than 0",
            "error"
          );
          return;
        }
      }

      setLoading(true);

      const res = await api.post("/AdminPrivileges/approve-worker-profile", {
        id: worker.id,
        key,
        suspendDays,
        reason,
      });

      if (res.status === 200) {
        if (key === 3) {
          await MySwal.fire("Success", "Worker approved successfully!", "success");
          setStatus(3);
        } else if (key === 4) {
          await MySwal.fire("Success", "Worker rejected successfully!", "success");
          setStatus(4);
        } else if (key === 1) {
          await MySwal.fire(
            "Suspended",
            suspendDays >= 9999
              ? "Worker suspended permanently"
              : `Worker suspended for ${suspendDays} days`,
            "warning"
          );
          setStatus(1);
        }
      }
    } catch (err) {
      console.error("Approval error:", err);
      await MySwal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold">{worker.name}</h2>
       <p className="text-gray-400 text-xs mt-1">
        <span className="font-medium">ID:</span> {worker.id}
      </p>
      <p className="text-gray-500 text-sm">{worker.phoneNumber}</p>
 
      <Link
        to={`/workers/${worker.id}`}
        className="inline-block mt-2 text-blue-600 text-sm font-medium hover:underline"
      >
        View Profile
      </Link>

      {/* Sent → Approve / Reject */}
      {status === 2 && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleApproval(3)}
            disabled={loading}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleApproval(4)}
            disabled={loading}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}

      {/* Verified → Show Verified + Suspend */}
      {status === 3 && (
        <div className="mt-3">
          <p className="text-green-600 font-medium text-sm">✔ Verified</p>
          <button
            onClick={() => handleApproval(1)}
            disabled={loading}
            className="mt-2 px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition disabled:opacity-50"
          >
            Suspend
          </button>
        </div>
      )}

      {/* Rejected → Only label (no suspend) */}
      {status === 4 && (
        <p className="mt-3 text-red-600 font-medium text-sm">✖ Rejected</p>
      )}

      {/* Suspended → label only */}
      {status === 1 && (
        <p className="mt-3 text-yellow-600 font-medium text-sm">⚠ Suspended</p>
      )}
    </div>
  );
};

export default WorkerCard;
