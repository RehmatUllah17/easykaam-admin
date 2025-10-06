  // src/api.ts
  import axios from "axios";

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // Attach token to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle expired token
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If unauthorized (401) and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

        const { accessToken, refreshToken: newRefreshToken } = res.data;

  // Update both tokens in storage
  localStorage.setItem("accessToken", accessToken);
  if (newRefreshToken) {
    localStorage.setItem("refreshToken", newRefreshToken);
  }

  api.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
  processQueue(null, accessToken);

  return api(originalRequest);
} catch (err) {
  processQueue(err, null);
  localStorage.clear();
  window.location.href = "/login"; // force re-login
  return Promise.reject(err);
} finally {
  isRefreshing = false;
}
      }

      return Promise.reject(error);
    }
  );

  export default api;
