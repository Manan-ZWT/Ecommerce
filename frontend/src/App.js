import React from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import { HomePage } from "./components/HomePage/HomePage";
import { SearchFilters } from "./components/SearchProducts/SearchProducts";
import { LoginForm } from "./components/AuthPages/LoginPage";
import { SignupForm } from "./components/AuthPages/signup";
import { ShowCart } from "./components/cartPage/showCart";
import { ProductById } from "./components/ProductPage/ProductById";
import { Updateuser } from "./components/UserProfilePages/Profile";
import { OrderPage } from "./components/OrderPages/OrderPage";
import { AdminNavBar } from "./components/AdminPages/AdminNavBar";
import { AddProduct } from "./components/AdminPages/AddProductForm";
import { AddCategory } from "./components/AdminPages/AddCategoryForm";
import { UpdateProduct } from "./components/AdminPages/UpdateProductForm";
import { UpdateStatus } from "./components/AdminPages/UpdateOrderStatus";
import { ForgetPassword } from "./components/AuthPages/ForgetPassword";

export const App = () => {
  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/search" element={<SearchFilters />} />
        <Route path="/products/:id" element={<ProductById />} />
        <Route path="/profile" element={<Updateuser />} />
        <Route path="/cart" element={<ShowCart />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset" element={<ForgetPassword />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin" element={<AdminNavBar />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/category" element={<AddCategory />} />
        <Route path="/edit/:id" element={<UpdateProduct />} />
        <Route path="/updatestatus" element={<UpdateStatus />} />
      </Routes>
    </>
  );
};

export default App;
