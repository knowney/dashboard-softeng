import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx"; // หน้า Dashboard

import Setting from "./pages/setting/Setting.jsx"; // หน้า Setting
import User from "./pages/manage/submenu/User.jsx"; // หน้า User
import Bin from "./pages/manage/submenu/Bin.jsx"; // หน้า Bin
import Category from "./pages/manage/submenu/Category.jsx"; // หน้า Category

// กำหนด router ด้วย createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />, // เส้นทางสำหรับ Dashboard
      },
      {
        path: "manage",
        children: [
          {
            path: "user",
            element: <User />, // เส้นทางย่อยสำหรับ User
          },
          {
            path: "bin",
            element: <Bin />, // เส้นทางย่อยสำหรับ Bin
          },
          {
            path: "category",
            element: <Category />, // เส้นทางย่อยสำหรับ Category
          },
        ],
      },
      {
        path: "setting",
        element: <Setting />, // เส้นทางสำหรับ Setting
      },
    ],
  },
]);

// กำหนดการ render แอปด้วย RouterProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
