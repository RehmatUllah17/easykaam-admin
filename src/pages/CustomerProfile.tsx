import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCustomerById } from "../api/customers";

interface Customer {
  id?: string;
  name?: string;
  phoneNumber?: string;
  imageURL?: string | null;
  suspendedUntilUtc?: string | null;
  suspensionReason?: string | null;
}

interface JobHistory {
  jobId: string;
  jobTitle: string;
}

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobHistory, setJobHistory] = useState<JobHistory[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    // Fetch customer details
    fetchCustomerById(id)
      .then((res) => {
        console.log("Customer data:", res);
        setCustomer(res);
      })
      .catch((err) => setError(err.message || "Failed to load customer profile"));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // Fetch customer job history
    const fetchJobHistory = async () => {
      try {
        setLoadingJobs(true);
        const response = await fetch(
          `https://easy-kaam-48281873f974.herokuapp.com/api/job-complaints/get-all-jobs-by-customer-id?CustomerId=${id}`
        );
        const data = await response.json();
        console.log("Job history:", data);
        setJobHistory(data || []);
      } catch (err) {
        console.error("Error fetching job history:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobHistory();
  }, [id]);

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!customer) return <p className="p-6 text-gray-600">Loading...</p>;

  const imageUrl =
    customer.imageURL && customer.imageURL !== "Not Found"
      ? customer.imageURL
      : null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-8 text-white text-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={customer.name || "Profile"}
            className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg mb-4"
          />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm mb-4">
            No Image
          </div>
        )}
        <h1 className="text-3xl font-bold">
          {customer.name || "No Name Provided"}
        </h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Contact Info */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Contact Information
          </h2>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span>{" "}
            {customer.phoneNumber || "N/A"}
          </p>
        </div>

        {/* Account Status */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Account Status
          </h2>
          {customer.suspendedUntilUtc ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-red-400 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">
                    Account Suspended
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Suspended until:{" "}
                    {new Date(customer.suspendedUntilUtc).toLocaleDateString()}
                  </p>
                  {customer.suspensionReason && (
                    <p className="mt-1 text-sm text-red-700">
                      Reason: {customer.suspensionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-400 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-green-800">
                    Active Account
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    This customer account is active and in good standing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Job History
          </h2>
          {loadingJobs ? (
            <p className="text-gray-600">Loading job history...</p>
          ) : jobHistory.length === 0 ? (
            <p className="text-gray-600">No job history found for this customer.</p>
          ) : (
            <ul className="space-y-3">
              {jobHistory.map((job) => (
                <li
                  key={job.jobId}
                  className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border"
                >
                  <span className="text-gray-800 font-medium">
                    {job.jobTitle}
                  </span>
                  <span className="text-xs text-gray-500">{job.jobId}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
