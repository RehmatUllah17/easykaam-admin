import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWorkerById } from "../api/workers";


const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (id) {
      fetchWorkerById(id)
        .then((data) => {
          console.log("Fetched worker data:", data);
          setWorker(data);
        })
        .catch((err) => setError(err.message));
    }
  }, [id]);

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!worker) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Name */}
      <h1 className="text-3xl font-bold mb-6 text-center">{worker.name ?? "No Name"}</h1>

      {/* Profile Picture */}
      {worker.imageURL && worker.imageURL !== "Not Found" && (
        <div className="flex justify-center mb-6">
          <img
            src={worker.imageURL}
            alt={worker.name}
            className="w-40 h-40 object-cover rounded-full shadow-md border border-gray-200"
          />
        </div>
      )}

      {/* Phone */}
      <p className="text-lg mb-4">
        <span className="font-semibold">Phone:</span> {worker.phoneNumber ?? "N/A"}
      </p>

      {/* Documents */}
      <div className="mt-4 space-y-4">
        <div>
          <p className="font-semibold mb-2">ID Card:</p>
          {worker.idCardURL && worker.idCardURL !== "Not Found" ? (
            <a href={worker.idCardURL} target="_blank" rel="noopener noreferrer">
              <img
                src={worker.idCardURL}
                alt="ID Card"
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg border border-gray-200 object-contain"
              />
            </a>
          ) : (
            <p className="text-gray-500">Not Found</p>
          )}
        </div>

        <div>
          <p className="font-semibold mb-2">Police Clearance:</p>
          {worker.policeClearanceURL && worker.policeClearanceURL !== "Not Found" ? (
            <a
              href={worker.policeClearanceURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={worker.policeClearanceURL}
                alt="Police Clearance"
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg border border-gray-200 object-contain"
              />
            </a>
          ) : (
            <p className="text-gray-500">Not Found</p>
          )}
        </div>
      </div>

      {/* Suspension Details */}
      {worker.suspendedUntilUtc && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <h2 className="text-lg font-semibold mb-2">Suspension Details</h2>
          <p>
            <strong>Suspended Until:</strong>{" "}
            {new Date(worker.suspendedUntilUtc).toLocaleString()}
          </p>
          {worker.suspensionReason && (
            <p>
              <strong>Reason:</strong> {worker.suspensionReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;
