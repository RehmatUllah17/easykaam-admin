import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Workers from "./pages/Workers";
import WorkerProfile from "./pages/WorkerProfile";
import AdminLayout from "./layouts/AdminLayout";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import "./index.css";

function App() {
  const accessToken = localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            accessToken ? <AdminLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="workers" replace />} />
          <Route path="workers" element={<Workers />} />
          <Route path="workers/:id" element={<WorkerProfile />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />

        </Route>

        <Route path="*" element={<p className="p-6">Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
