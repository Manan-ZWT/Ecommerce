import React from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import { HomePage } from "./components/HomePage/HomePage";
import { SearchFilters } from "./components/SearchProducts/SearchProducts";

export const App = () => {
  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/search" element={<SearchFilters/>} />
        <Route path="" element={<h1>Contact Page</h1>} />
      </Routes>
    </>
  );
};

export default App;
