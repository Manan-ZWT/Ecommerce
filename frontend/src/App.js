import React from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
export const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<NavBar></NavBar>} />
        <Route path="/profile" element={<h1>Blogs Page</h1>} />
        <Route path="" element={<h1>Contact Page</h1>} />
      </Routes>
    </>
  );
};

export default App;
