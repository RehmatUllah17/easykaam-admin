const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchWorkers = async (
  page: number,
  pageSize: number,
  statusKey?: number
) => {
  const token = localStorage.getItem("accessToken");
  const url = new URL(`${API_BASE}/AdminPrivileges/get-all-workers-profiles`);
  url.searchParams.append("PageNumber", page.toString());
  url.searchParams.append("PageSize", pageSize.toString());
  if (statusKey) url.searchParams.append("StatusKey", statusKey.toString());
  const res = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch workers");
  return res.json(); 
};

export const fetchWorkerById = async (id: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${API_BASE}/AdminPrivileges/get-worker-profile-by-id?Id=${id}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch worker: ${res.status} ${errorText}`);
  }
  const result = await res.json();
  console.log("🔎 Worker by ID response:", result);
  return result.data ?? result; 
};
