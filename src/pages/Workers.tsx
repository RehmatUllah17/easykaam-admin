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
    w.id ??
    w.workerId ??
    w.userId ??
    w.profileId ??
    w.idGuid ??
    w._id;

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

  const imageURL =
    w.profileImageUrl ??
    w.profileImage ??
    w.imageURL ??
    null;

  const idCardURL = w.idCardURL ?? w.idCardUrl ?? w.idCard ?? null;

  const policeClearanceURL =
    w.policeClearanceURL ??
    w.policeClearance ??
    null;

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

      if (Array.isArray(res?.data)) {
        arr = res.data;
      } else if (Array.isArray((res as any)?.items)) {
        arr = (res as any).items;
      } else if (Array.isArray(res as any)) {
        arr = res as unknown as any[];
      }

      setWorkersByStatus((prev) => ({
        ...prev,
        [statusKey]: {
          data: arr.map((w) => normalizeApiWorker(w, statusKey)),
          page: res.pageNumber ?? page,
          totalPages: res.totalPages ?? 1,
        },
      }));
    } catch (err) {
      console.error("loadWorkers error:", err);
    }
  };

  useEffect(() => {
    Object.keys(STATUS_MAP).forEach((key) => loadWorkers(Number(key), 1));
  }, []);

  const getStatusColor = (statusKey: number) => {
    const colors = {
      1: "from-orange-500 to-amber-500 border-orange-200",
      2: "from-blue-500 to-cyan-500 border-blue-200", 
      3: "from-green-500 to-emerald-500 border-green-200",
      4: "from-red-500 to-rose-500 border-red-200"
    };
    return colors[statusKey as keyof typeof colors];
  };

  const getStatusIcon = (statusKey: number) => {
    const icons = {
      1: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      2: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      3: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      4: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[statusKey as keyof typeof icons];
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Worker Management
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Manage and monitor worker verification status
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="flex items-center gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(workersByStatus).reduce((total, status) => total + status.data.length, 0)}
                </p>
                <p className="text-sm text-gray-600 font-medium">Total Workers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Component */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-sm">
        <WorkerSearch
          onResults={setSearchResults}
          normalizeApiWorker={normalizeApiWorker}
        />
      </div>

      {/* Status Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.entries(STATUS_MAP).map(([statusKey, label]) => {
          const key = Number(statusKey);
          const { data, page, totalPages } = workersByStatus[key] || {
            data: [],
            page: 1,
            totalPages: 1,
          };

          const filteredData = searchResults
            ? searchResults.filter((w) => Number(w.statusId) === key)
            : data;

          return (
            <div
              key={key}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden flex flex-col h-fit"
            >
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${getStatusColor(key)} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      {getStatusIcon(key)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{label}</h2>
                      <p className="text-white/80 text-sm font-medium">
                        {filteredData.length} workers
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold">
                    {filteredData.length}
                  </div>
                </div>
              </div>

              {/* Workers List */}
              <div className="flex-1 p-4 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
                {filteredData.length > 0 ? (
                  filteredData.map((worker) => (
                    <div key={worker.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                      <WorkerCard worker={worker} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">No workers found</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!searchResults && (
                <div className="p-4 border-t border-gray-200/60 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => loadWorkers(key, Math.max(1, page - 1))}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-sm"
                      disabled={page === 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Prev
                    </button>
                    
                    <span className="text-sm font-medium text-gray-600 px-3 py-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                      {page} / {totalPages}
                    </span>
                    
                    <button
                      onClick={() => loadWorkers(key, page + 1)}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-sm"
                      disabled={page >= totalPages}
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Workers;