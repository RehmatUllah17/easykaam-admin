import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWorkerById } from "../api/workers";

interface Worker {
  name?: string;
  imageURL?: string;
  phoneNumber?: string;
  professions?: string[];
  idCardURL?: string;
  policeClearanceURL?: string;
  suspendedUntilUtc?: string;
  suspensionReason?: string;
}

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    fetchWorkerById(id)
      .then(setWorker)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!worker) return <p className="p-6 text-gray-600">Loading...</p>;

  const hasImage = Boolean(worker.imageURL && worker.imageURL !== "Not Found");
  const hasIdCard = Boolean(worker.idCardURL && worker.idCardURL !== "Not Found");
  const hasPoliceClearance = Boolean(worker.policeClearanceURL && worker.policeClearanceURL !== "Not Found");
  const hasProfessions = Boolean(worker.professions && worker.professions.length > 0);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">
          {worker.name || "No Name Provided"}
        </h1>
        {hasImage && (
          <img
            src={worker.imageURL}
            alt={worker.name}
            className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Contact Info */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h2>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> {worker.phoneNumber || "N/A"}
          </p>
        </div>

        {/* Professions */}
        {hasProfessions && (
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Professions</h2>
            <div className="flex flex-wrap gap-2">
              {worker.professions!.map((profession, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {profession}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <DocumentCard
              title="ID Card"
              url={worker.idCardURL}
              hasDocument={hasIdCard}
            />
            <DocumentCard
              title="Police Clearance"
              url={worker.policeClearanceURL}
              hasDocument={hasPoliceClearance}
            />
          </div>
        </div>

        {/* Suspension Alert */}
        {worker.suspendedUntilUtc && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">Account Suspended</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>Suspended until: {new Date(worker.suspendedUntilUtc).toLocaleDateString()}</p>
                  {worker.suspensionReason && (
                    <p className="mt-1">Reason: {worker.suspensionReason}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for documents
const DocumentCard = ({ title, url, hasDocument }: { title: string; url?: string; hasDocument: boolean }) => (
  <div className="text-center">
    <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
    {hasDocument ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
        <img
          src={url}
          alt={title}
          className="w-full h-48 object-cover rounded-lg shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow"
        />
        <p className="mt-2 text-sm text-blue-600 hover:text-blue-800">View Document</p>
      </a>
    ) : (
      <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-500">Not Available</p>
      </div>
    )}
  </div>
);

export default WorkerProfile;