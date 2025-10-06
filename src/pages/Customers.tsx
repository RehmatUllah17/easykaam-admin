import { useEffect, useState } from "react";
import { fetchCustomers, searchCustomerById } from "../api/customers";
import CustomerCard from "../components/CustomerCard";

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  profileImageUrl: string | null;
  suspendedUntilUtc: string | null;
  suspensionReason: string | null;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔍 Search states
  const [searchId, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load paginated customers
  useEffect(() => {
    if (searchResults) return; // skip pagination when search is active

    const loadCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetchCustomers(pageNumber, 12, 1);
        setCustomers(res.data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [pageNumber, searchResults]);

  // 🔍 Search handler
  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      setSearchLoading(true);
      const res = await searchCustomerById(searchId.trim());
      // API returns array with workerId instead of id
      const mapped = res.map((c: any) => ({
        id: c.workerId,
        name: c.name,
        phoneNumber: c.phoneNumber,
        profileImageUrl: c.profileImageUrl,
        suspendedUntilUtc: c.suspendedUntilUtc,
        suspensionReason: c.suspensionReason,
      }));
      setSearchResults(mapped);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>

      {/* 🔍 Search box */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Customer ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
        {searchResults && (
          <button
            onClick={() => {
              setSearchResults(null);
              setSearchId("");
            }}
            className="px-3 py-2 border rounded hover:bg-gray-100 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* 🔎 Search Results */}
      {searchLoading ? (
        <p>Searching...</p>
      ) : searchResults ? (
        searchResults.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {searchResults.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <p className="text-red-600">No customer found.</p>
        )
      ) : null}

      {/* 📋 Customer List (only when no search active) */}
      {!searchResults && (
        <>
          {loading ? (
            <p>Loading customers...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {pageNumber} of {totalPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
              disabled={pageNumber === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Customers;
