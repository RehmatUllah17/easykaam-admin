import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white/90 backdrop-blur-xl shadow-2xl p-6 flex flex-col border-r border-gray-200/60">
       
        <div className="mb-8 pt-4">
          <div className="flex items-center gap-3">
          
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Easykaam
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 flex-1">

       <Link
  to="/workers"
  className={`group px-4 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300
    ${location.pathname === "/workers"
      ? "bg-orange-50 border-orange-100 text-orange-600"
      : "text-gray-700 hover:bg-orange-50 hover:border-orange-100 hover:text-orange-600"}
  `}
>
  <div
    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
      ${location.pathname === "/workers"
        ? "bg-orange-200"
        : "bg-orange-100 group-hover:bg-orange-200"}
    `}
  >
    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  </div>
  <span className="font-medium">Workers</span>
</Link>

      <Link
  to="/customers"
  className={`group px-4 py-3 rounded-2xl flex items-center gap-3 border transition-all duration-300
    ${location.pathname === "/customers"
      ? "bg-blue-50 border-blue-100 text-blue-600"
      : "text-gray-700 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 border-transparent"}
  `}
>
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
    ${location.pathname === "/customers" ? "bg-blue-200" : "bg-blue-100 group-hover:bg-blue-200"}`}
  >
    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  </div>
  <span className="font-medium">Customers</span>
</Link>


<Link
  to="/base-price"
  className={`group px-4 py-3 rounded-2xl flex items-center gap-3 border transition-all duration-300
    ${location.pathname === "/base-price"
      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
      : "text-gray-700 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600 border-transparent"}
  `}
>
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
    ${location.pathname === "/base-price" ? "bg-emerald-200" : "bg-emerald-100 group-hover:bg-emerald-200"}`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M3 3v18h18M7 13v5M11 9v9M15 11v7M19 7v11M9 5h6M12 5v4" />
    </svg>
  </div>
  <span className="font-medium">Base Price</span>
</Link>


   <Link
  to="/complaints"
  className={`group px-4 py-3 rounded-2xl flex items-center gap-3 border transition-all duration-300
    ${location.pathname === "/complaints"
      ? "bg-red-50 border-red-100 text-red-600"
      : "text-gray-700 hover:bg-red-50 hover:border-red-100 hover:text-red-600 border-transparent"}
  `}
>
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
    ${location.pathname === "/complaints" ? "bg-red-200" : "bg-red-100 group-hover:bg-red-200"}`}
  >
    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>
  <span className="font-medium">Rework Requests</span>
</Link>


<Link
  to="/support"
  className={`group px-4 py-3 rounded-2xl flex items-center gap-3 border transition-all duration-300
    ${location.pathname === "/support"
      ? "bg-teal-50 border-teal-100 text-teal-600"
      : "text-gray-700 hover:bg-teal-50 hover:border-teal-100 hover:text-teal-600 border-transparent"}
  `}
>
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
    ${location.pathname === "/support" ? "bg-teal-200" : "bg-teal-100 group-hover:bg-teal-200"}`}
  >
    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M18 10H6m0 0l6-6m-6 6l6 6"
      />
    </svg>
  </div>
  <span className="font-medium">Customer Support</span>
</Link>




          
         <Link
  to="/settings"
  className={`group px-4 py-3 rounded-2xl flex items-center gap-3 border transition-all duration-300
    ${location.pathname === "/settings"
      ? "bg-purple-50 border-purple-100 text-purple-600"
      : "text-gray-700 hover:bg-purple-50 hover:border-purple-100 hover:text-purple-600 border-transparent"}
  `}
>
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
    ${location.pathname === "/settings" ? "bg-purple-200" : "bg-purple-100 group-hover:bg-purple-200"}`}
  >
    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  </div>
  <span className="font-medium">Settings</span>
</Link>

        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-6 border-t border-gray-200/60">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/60 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Admin</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-50/80 border border-gray-200/60">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Admin</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="group px-6 py-2.5 text-sm bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/60 p-8 min-h-[600px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;