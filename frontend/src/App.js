import React from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import { HomePage } from "./components/HomePage/HomePage";
import { SearchFilters } from "./components/SearchProducts/SearchProducts";
import { LoginForm } from "./components/AuthPages/LoginPage";
import { SignupForm } from "./components/AuthPages/signup";
import { ShowCart } from "./components/cartPage/showCart";

export const App = () => {
  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/search" element={<SearchFilters/>} />
        <Route path="/profile" element={<h1>Profile Page</h1>} />
        <Route path="/cart" element={<ShowCart/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
      </Routes>
    </>
  );
};

export default App;
