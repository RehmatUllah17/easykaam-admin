import React, { useState } from "react";
import { suspendCustomer } from "../api/customers";

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  profileImageUrl: string | null;
  suspendedUntilUtc: string | null;
  suspensionReason: string | null;
}

const CustomerCard: React.FC<{ customer: Customer }> = ({ customer }) => {
  const [localCustomer, setLocalCustomer] = useState<Customer>(customer);

  const isSuspended = !!localCustomer.suspendedUntilUtc;

  const handleSuspend = async () => {
    try {
      const daysInput = prompt("Enter suspension days:", "7");
      if (!daysInput) return;
      const suspendDays = parseInt(daysInput, 10);

      if (isNaN(suspendDays) || suspendDays <= 0) {
        alert("Invalid number of days!");
        return;
      }

      const reason = prompt("Enter reason for suspension:", "Violation of terms");
      if (!reason) return;

      // call API
      await suspendCustomer(localCustomer.id, 0, suspendDays, reason);

      // mark customer as suspended in UI
      const until = new Date();
      until.setDate(until.getDate() + suspendDays);

      setLocalCustomer({
        ...localCustomer,
        suspendedUntilUtc: until.toISOString(),
        suspensionReason: reason,
      });

      alert("Customer suspended successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to suspend customer");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-start space-x-4 hover:shadow-lg transition">
      <img
        src={
          localCustomer.profileImageUrl ||
          "https://via.placeholder.com/80x80.png?text=User"
        }
        alt={localCustomer.name}
        className="w-16 h-16 rounded-full object-cover border"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{localCustomer.name}</h2>
        <p className="text-sm text-gray-700">📞 {localCustomer.phoneNumber}</p>
        <p className="text-xs text-gray-500">🆔 {localCustomer.id}</p>

        {isSuspended ? (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            <p>
              <strong>Suspended Until:</strong>{" "}
              {new Date(localCustomer.suspendedUntilUtc!).toLocaleString()}
            </p>
            {localCustomer.suspensionReason && (
              <p>
                <strong>Reason:</strong> {localCustomer.suspensionReason}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-green-600 text-sm">✅ Active</p>
        )}

        {/* Show suspend button only if active */}
        {!isSuspended && (
          <button
            onClick={handleSuspend}
            className="mt-3 px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Suspend
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;
