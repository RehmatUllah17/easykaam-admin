const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchCustomers = async (
  page: number,
  pageSize: number,
  statusKey?: number
) => {
  const token = localStorage.getItem("accessToken");
  const url = new URL(`${API_BASE}/AdminPrivileges/get-all-customer-profiles`);
  url.searchParams.append("PageNumber", page.toString());
  url.searchParams.append("PageSize", pageSize.toString());
  if (statusKey) url.searchParams.append("StatusKey", statusKey.toString());

  const res = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};

export const fetchCustomerById = async (id: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${API_BASE}/AdminPrivileges/get-customer-profile-by-id?Id=${id}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch customer: ${res.status} ${errorText}`);
  }

  const result = await res.json();
  console.log("Customer by ID response:", result);
  return result.data ?? result;
};

export const searchCustomerById = async (id: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${API_BASE}/AdminPrivileges/search-customer-profile?Id=${id}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Search failed: ${res.status} ${errorText}`);
  }

  const result = await res.json();
  console.log("Search API response:", result);
  return Array.isArray(result) ? result : [];
};

export const suspendCustomer = async (
  id: string,
  key: number,
  suspendDays: number,
  reason: string
) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${API_BASE}/AdminPrivileges/suspend-customer-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, key, suspendDays, reason }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to suspend customer: ${res.status} ${errorText}`);
  }

  return res.json();
};
