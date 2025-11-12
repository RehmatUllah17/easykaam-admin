import { useEffect, useState } from "react";
import { fetchWorkers } from "../api/workers";
import WorkerCard from "../components/WorkerCard";
import WorkerSearch from "../components/WorkerSearch";

const STATUS_MAP: Record<number, string> = {
  1: "Suspended",
  2: "Sent",
  3: "Verified",
  4: "Rejected",
};

type WorkerResponse = {
  data: any[];
  pageNumber?: number;
  pageSize?: number;
  totalRecords?: number;
  totalPages?: number;
};

type WorkersState = Record<
  number,
  { data: any[]; page: number; totalPages: number }
>;

const pageSize = 15;

export const normalizeApiWorker = (w: any, fallbackStatus?: number) => {
  const id =
    w.id ?? w.workerId ?? w.userId ?? w.profileId ?? w.idGuid ?? w._id;

  const name =
    w.name ??
    w.fullName ??
    w.userName ??
    w.displayName ??
    w.firstName ??
    "";

  const phoneNumber =
    w.phoneNumber ??
    w.phone ??
    w.phone_no ??
    w.contactNumber ??
    w.mobileNumber ??
    "";

  const imageURL = w.profileImageUrl ?? w.profileImage ?? w.imageURL ?? null;
  const idCardURL = w.idCardURL ?? w.idCardUrl ?? w.idCard ?? null;
  const policeClearanceURL =
    w.policeClearanceURL ?? w.policeClearance ?? null;

  const statusId = Number(
    w.verificationStatusId ??
      w.statusId ??
      w.status ??
      w.statusKey ??
      fallbackStatus ??
      3
  );

  return {
    ...w,
    id,
    name,
    phoneNumber,
    imageURL,
    idCardURL,
    policeClearanceURL,
    statusId,
  };
};

const Workers = () => {
  const [workersByStatus, setWorkersByStatus] = useState<WorkersState>({
    1: { data: [], page: 1, totalPages: 1 },
    2: { data: [], page: 1, totalPages: 1 },
    3: { data: [], page: 1, totalPages: 1 },
    4: { data: [], page: 1, totalPages: 1 },
  });

  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const loadWorkers = async (statusKey: number, page: number) => {
    try {
      const res: WorkerResponse = await fetchWorkers(page, pageSize, statusKey);

      let arr: any[] = [];
      if (Array.isArray(res?.data)) arr = res.data;
      else if (Array.isArray((res as any)?.items)) arr = (res as any).items;
      else if (Array.isArray(res as any)) arr = res as unknown as any[];

      setWorkersByStatus((prev) => ({
        ...prev,
        [statusKey]: {
          data: arr.map((w) => normalizeApiWorker(w, statusKey)),
          page,
          totalPages: res.totalPages ?? 1,
        },
      }));
    } catch (err) {
      console.error("loadWorkers error:", err);
    }
  };

  useEffect(() => {
    [1, 2, 3, 4].forEach((key) => loadWorkers(key, 1));
  }, []);

  const getStatusColor = (statusKey: number) => {
    const colors = {
      1: "from-orange-500 to-amber-500 border-orange-200",
      2: "from-blue-500 to-cyan-500 border-blue-200",
      3: "from-green-500 to-emerald-500 border-green-200",
      4: "from-red-500 to-rose-500 border-red-200",
    };
    return colors[statusKey as keyof typeof colors];
  };

  const getStatusIcon = (statusKey: number) => {
    const icons = {
      1: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      2: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ),
      3: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      4: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };
    return icons[statusKey as keyof typeof icons];
  };

  const combinedData = [
    ...workersByStatus[1].data.map((w) => ({ ...w, combined: true })),
    ...workersByStatus[4].data.map((w) => ({ ...w, combined: true })),
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Worker Management
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Manage and monitor worker verification status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(workersByStatus).reduce(
                    (total, s) => total + s.data.length,
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Total Workers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm">
        <WorkerSearch
          onResults={setSearchResults}
          normalizeApiWorker={normalizeApiWorker}
        />
        {searchResults && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setSearchResults(null)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              ← Back to All Workers
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((worker) => (
                <div
                  key={worker.id}
                  className="transform hover:scale-[1.02] transition-transform duration-200"
                >
                  <WorkerCard worker={worker} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 font-medium">
              No workers found.
            </p>
          )}
        </div>
      ) : (
        /* Default 3-column grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[2, 3, "combined"].map((key) => {
            let label = "";
            let data: any[] = [];

         if (key === 2 || key === 3) {
           label = STATUS_MAP[key as number];
           data = workersByStatus[key as number].data;
            } else {
                  label = "Suspended + Rejected";
                     data = combinedData;
                    }


            const page =
              key === "combined"
                ? 1
                : workersByStatus[key as number]?.page || 1;

            const cardsPerPage = 4;
            const totalLocalPages = Math.ceil(data.length / cardsPerPage);
            const startIndex = (page - 1) * cardsPerPage;
            const currentCards = data.slice(
              startIndex,
              startIndex + cardsPerPage
            );
{totalLocalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-600">
    Page {page} of {totalLocalPages}
  </div>
)}

            return (
              <div
                key={key.toString()}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden flex flex-col h-fit"
              >
                <div
                  className={`bg-gradient-to-r ${
                    key === 2
                      ? getStatusColor(2)
                      : key === 3
                      ? getStatusColor(3)
                      : "from-orange-500 to-red-500 border-red-200"
                  } p-6 text-white`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        {key === "combined"
                          ? getStatusIcon(4)
                          : getStatusIcon(key as number)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">{label}</h2>
                        <p className="text-white/80 text-sm font-medium">
                          {data.length} workers
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                      {data.length}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
                  {currentCards.length > 0 ? (
                    currentCards.map((worker) => (
                      <div
                        key={worker.id}
                        className="transform hover:scale-[1.02] transition-transform duration-200"
                      >
                        <WorkerCard worker={worker} />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                      <svg
                        className="w-12 h-12 mb-2 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium">No workers found</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Workers;
