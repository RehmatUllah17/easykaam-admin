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

      const arr = Array.isArray(res?.data) ? res.data : [];

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

  const combinedData = [
    ...workersByStatus[1].data,
    ...workersByStatus[4].data,
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Worker Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Manage and monitor worker verification status
          </p>
        </div>

        <div className="bg-white rounded-xl px-4 py-3 border shadow-sm flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
            {Object.values(workersByStatus).reduce(
              (total, s) => total + s.data.length,
              0
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">Total Workers</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl p-4 md:p-6 border shadow-sm">
        <WorkerSearch
          onResults={setSearchResults}
          normalizeApiWorker={normalizeApiWorker}
        />

        {searchResults && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setSearchResults(null)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              ← Back to All Workers
            </button>
          </div>
        )}
      </div>

      {/* SEARCH RESULTS */}
      {searchResults ? (
        <div className="bg-white rounded-xl border p-4 md:p-6 shadow">
          <h2 className="text-lg font-bold mb-4">Search Results</h2>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No workers found.
            </p>
          )}
        </div>
      ) : (
        /* STATUS COLUMNS */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[2, 3, "combined"].map((key) => {
            let label = "";
            let data: any[] = [];

            if (key === 2 || key === 3) {
              label = STATUS_MAP[key];
              data = workersByStatus[key].data;
            } else {
              label = "Suspended + Rejected";
              data = combinedData;
            }

            const page = 1;
            const cardsPerPage = 4;
            const startIndex = (page - 1) * cardsPerPage;
            const currentCards = data.slice(
              startIndex,
              startIndex + cardsPerPage
            );

            return (
              <div
                key={key.toString()}
                className="bg-white rounded-2xl border shadow flex flex-col"
              >
                {/* COLUMN HEADER */}
                <div className="p-5 bg-gray-900 text-white rounded-t-2xl">
                  <h2 className="text-lg font-bold">{label}</h2>
                  <p className="text-sm opacity-80">{data.length} workers</p>
                </div>

                {/* CARDS */}
                <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
                  {currentCards.length > 0 ? (
                    currentCards.map((worker) => (
                      <WorkerCard key={worker.id} worker={worker} />
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-12 text-sm">
                      No workers found
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
