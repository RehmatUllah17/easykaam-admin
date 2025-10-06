import { useState, useEffect } from "react";
import api from "../api";

type WorkerSearchProps = {
  onResults: (workers: any[] | null) => void;
  normalizeApiWorker: (w: any, fallbackStatus?: number) => any;
};

const WorkerSearch = ({ onResults, normalizeApiWorker }: WorkerSearchProps) => {
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search by name
  useEffect(() => {
    if (!searchName) {
      onResults(null);
      setError("");
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/AdminPrivileges/search-worker-profile", {
          params: { name: searchName },
        });

        let items: any[] = [];
        const payload = res.data;

        if (Array.isArray(payload)) {
          items = payload;
        } else if (Array.isArray(payload?.data)) {
          items = payload.data;
        } else if (payload?.data && typeof payload.data === "object") {
          items = [payload.data];
        } else if (payload) {
          items = [payload];
        }

        const normalized = items.map((w) => normalizeApiWorker(w));
        onResults(normalized.length ? normalized : []);
      } catch (err: any) {
        console.error("Search by name error:", err);
        onResults(null);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchName]);

  // Search by Worker ID
  const handleSearchById = async () => {
    onResults(null);
    setError("");

    if (!searchId.trim()) {
      setError("Please enter Worker ID");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/AdminPrivileges/search-worker-profile", {
        params: { workerId: searchId.trim() },
      });

      let items: any[] = [];
      const payload = res.data;

      if (Array.isArray(payload)) {
        items = payload;
      } else if (Array.isArray(payload?.data)) {
        items = payload.data;
      } else if (payload?.data && typeof payload.data === "object") {
        items = [payload.data];
      } else if (payload) {
        items = [payload];
      }

      const normalized = items.map((w) => normalizeApiWorker(w));
      onResults(normalized.length ? normalized : []);
    } catch (err: any) {
      console.error("Search by ID error:", err);
      onResults(null);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchName("");
    setSearchId("");
    setError("");
    onResults(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Search Workers</h2>
          <p className="text-sm text-gray-600">Find workers by name or ID</p>
        </div>
      </div>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search by Name */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-1 shadow-sm">
            <div className="flex items-center gap-3 px-3 py-1">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by worker name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="flex-1 py-3 bg-transparent border-0 focus:ring-0 text-gray-700 placeholder-gray-400 font-medium outline-none"
              />
              {searchName && (
                <button
                  onClick={() => setSearchName("")}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search by ID */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-1 shadow-sm">
            <div className="flex items-center gap-3 px-3 py-1">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by worker ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 py-3 bg-transparent border-0 focus:ring-0 text-gray-700 placeholder-gray-400 font-medium outline-none"
              />
              <button
                onClick={handleSearchById}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 font-semibold text-sm flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search ID
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-blue-700">Searching workers...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl border border-red-200">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Clear Search Button */}
        {(searchName || searchId || error) && (
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Clear Search
          </button>
        )}
      </div>

      {/* Search Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-700">Search Tips</p>
            <p className="text-xs text-gray-600 mt-1">
              • Name search updates automatically • Worker ID requires manual search • Both fields can be used independently
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerSearch;