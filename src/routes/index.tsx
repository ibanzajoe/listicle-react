import { Outlet, Route, Routes } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import AuthMiddleware from "@/middleware/AuthMiddleware";
import UsersPage from "@/pages/AdminPages/UsersPage";
import CategoriesPage from "@/pages/AdminPages/CategoriesPage";
import ProductsPage from "@/pages/AdminPages/ProductsPage";
import OrdersPage from "@/pages/AdminPages/OrdersPage";
import SettingsPage from "@/pages/AdminPages/SettingsPage";
import ReportPage from "@/pages/AdminPages/ReportPage";
import UserDetailPage from "@/pages/AdminPages/UserDetailPage";
import { AdminUsersProvider } from "@/context/AdminUsersContext";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route path="/" element={<AuthMiddleware><DefaultLayout /></AuthMiddleware>} />
      <Route path="/admin" element={<AuthMiddleware><DefaultLayout /></AuthMiddleware>}>
        <Route path="/admin" element={<HomePage />} />
        <Route 
          path="/admin/users" 
          element={
            <AdminUsersProvider />
          }
        >
          <Route index element={<UsersPage />} />
          <Route path="/admin/users/:userId" element={<UserDetailPage />} />
        </Route>
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/reports" element={<ReportPage />} />
      </Route>

      {/* Public Routes */}
      <Route path="/signin" element={<LoginPage />} />
    </Routes>
  )
}