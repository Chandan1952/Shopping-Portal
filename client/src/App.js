import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminBannerImage from "./components/AdminBannerImage";
import AdminManageCarousel from "./components/AdminManageCarousel";
import AdminBrand from "./components/AdminBrand";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UserProfilePage from "./components/UserProfilePage";
import UserChangePassword from "./components/UserChangePassword";
import ProductList from "./components/ProductCard";
import AdminCreateProduct from "./components/AdminCreateProduct";
import AdminCreateCategory from "./components/AdminCreateCategory";
import AdminManageCategory from "./components/AdminManageCategory";
import AdminManageProduct from "./components/AdminManageProduct";
import AdminManageBrand from "./components/AdminManageBrand";
import AdminManageUsers from "./components/AdminManageUsers";
import CartPage from "./components/CartPage";
import OrderReturnPage from "./components/OrderReturnPage";
import ProductDetail from "./components/ProductDetail";
import Wishlist from "./components/Wishlist";
import AdminManageOrders from "./components/AdminManageOrders";
import ContactUs from "./components/ContactUs";
import GiftCard from "./components/GiftCard";
import UpdateContactInfo from "./components/AdminUpdateContactInfo";
import ManageQueries from "./components/AdminManageQueries";
import AdminManageGiftCard from "./components/AdminManageGiftCard";













function App() {
  return (
    <Router>
      <Routes>
       


        <Route path="/" element={<Home />} />
         <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/:category" element={<ProductList />} /> {/* Dynamic category route */}
        <Route path="/card-list" element={<CartPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/gift-cards" element={<GiftCard />} />





        <Route path="/edit-profile" element={<UserProfilePage />} />
        <Route path="/update-password" element={<UserChangePassword />} />
        <Route path="/order-status/:orderId" element={<OrderReturnPage />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* ✅ Product Detail Page */}
        <Route path="/wishlist" element={<Wishlist />} />











        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-Banner" element={<AdminBannerImage />} />
        <Route path="/admin-managebanner" element={<AdminManageCarousel />} />
        <Route path="/admin-brand" element={<AdminBrand />} />
        <Route path="/admin-createproduct" element={<AdminCreateProduct />} />
        <Route path="/admin-createcategory" element={<AdminCreateCategory />} />
        <Route path="/admin-managecategory" element={<AdminManageCategory />} />
        <Route path="/admin-manageproduct" element={<AdminManageProduct />} />
        <Route path="/admin-managebrand" element={<AdminManageBrand />} />
        <Route path="/adminmanageusers" element={<AdminManageUsers />} />
        <Route path="/admin-manageorder" element={<AdminManageOrders />} />
        <Route path="/admin-updatedcontactinfo" element={<UpdateContactInfo />} />
        <Route path="/admin-managequery" element={<ManageQueries />} />
        <Route path="/admin-managegiftcard" element={<AdminManageGiftCard />} />


      </Routes>
    </Router>
  );
}

export default App;
