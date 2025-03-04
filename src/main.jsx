import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ourlayout/AppLayout.jsx"; // ✅ ใช้ Layout หลัก
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Setting from "./pages/setting/Setting.jsx";
import User from "./pages/manage/submenu/User.jsx";
import Bin from "./pages/manage/submenu/Bin.jsx";
import Category from "./pages/manage/submenu/Category.jsx";
import Login from "./pages/login/login.jsx";
import Index from "./pages/index/Index.jsx";
import WorkDay from "./pages/working/WorkDay.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx"; // ✅ Import ProtectedRoute

// กำหนด router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />, // ✅ หน้า Login ไม่มี Layout
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout /> {/* ✅ Layout ใช้หลังจากล็อกอินเท่านั้น */}
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "work-day", element: <WorkDay /> },
      {
        path: "manage",
        children: [
          { path: "user", element: <User /> },
          { path: "bin", element: <Bin /> },
          { path: "category", element: <Category /> },
        ],
      },
      { path: "setting", element: <Setting /> },
      { path: "/", element: <Index /> },
    ],
  },
]);

// กำหนดการ render แอปด้วย RouterProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
