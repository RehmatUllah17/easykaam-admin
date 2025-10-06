import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const IDLE_TIMEOUT = 15 * 60 * 1000;

const Login = () => {
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let idleTimer: ReturnType<typeof setTimeout>;
  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    // Restore saved credentials if "Remember Me" was checked
    const savedName = localStorage.getItem("savedName");
    const savedPhone = localStorage.getItem("savedPhoneNo");
    if (savedName && savedPhone) {
      setName(savedName);
      setPhoneNo(savedPhone);
      setRememberMe(true);
    }

    const events = ["mousemove", "keydown", "click"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/AdminPrivileges/login-as-admin", {
        name,
        phoneNo,
      });

      const { accessToken, refreshToken, role, userId } = res.data;

      // Save tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // Save credentials only if "Remember Me" checked
      if (rememberMe) {
        localStorage.setItem("savedName", name);
        localStorage.setItem("savedPhoneNo", phoneNo);
      } else {
        localStorage.removeItem("savedName");
        localStorage.removeItem("savedPhoneNo");
      }

      window.location.href = "/";
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && (
          <p className="mb-3 text-red-600 text-sm text-center">{error}</p>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        {/* Remember Me checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Remember Me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
