import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { logout } from "../AuthPages/Logout";

export const NavBar = () => {
  return (
    <>
      <header>
        <div className="navbardiv">
          <Link to="/">
            <img src="/images/Logo.png?" alt="" />
          </Link>
          <ul>
            <li>
              {/* <input type="text" placeholder="Enter the product name" className="searchProduct" /> */}
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};
