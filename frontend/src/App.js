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
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin" element={<AdminNavBar />} />
      </Routes>
    </>
  );
};

export default App;
