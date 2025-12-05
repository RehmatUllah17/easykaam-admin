import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const menu = [
    { name: "Workers", path: "/workers", color: "orange" },
    { name: "Customers", path: "/customers", color: "blue" },
    { name: "Base Price", path: "/base-price", color: "emerald" },
    { name: "Rework Requests", path: "/complaints", color: "red" },
    { name: "Customer Support", path: "/support", color: "teal" },
    { name: "Settings", path: "/settings", color: "purple" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed z-50 lg:static top-0 left-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* LOGO */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Easykaam
            </h1>
            <p className="text-sm text-gray-500 ml-1">Admin Dashboard</p>
          </div>

          {/* MENU */}
          <nav className="flex flex-col gap-3 flex-1">
            {menu.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all
                    ${
                      active
                        ? `bg-${item.color}-100 text-${item.color}-600`
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* PROFILE */}
          <div className="border-t pt-4 mt-auto">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl">
                A
              </div>
              <div>
                <p className="font-semibold">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* HAMBURGER */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-gray-100"
            >
              ☰
            </button>

            <div>
              <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>
              <p className="text-xs md:text-sm text-gray-500">Welcome back, Admin</p>
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
              <span className="font-medium text-sm">Admin</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 md:px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border p-4 md:p-8 min-h-[400px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
