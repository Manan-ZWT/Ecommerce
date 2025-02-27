import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../Context/UserContext.js";
import "./NavBar.css";
import { logout } from "../AuthPages/Logout";

export const NavBar = () => {
  const location = useLocation();
  const { userdata } = useUser();
  useEffect(() => {
  }, [location]);

  return (
    <>
      <header>
        <div className="navbardiv">
          <Link to="/">
            <img src="/images/Logo.png?" alt="" />
          </Link>
          <label className="hamburger-menu" for="hamburger-menu-toggle">
            <div className="hamburger"></div>
            <div className="hamburger"></div>
            <div className="hamburger"></div>
          </label>
          <input
            type="checkbox"
            className="hamburger-menu-toggle"
            id="hamburger-menu-toggle"
          />
          <ul>
            <li>
              {/* <input type="text" placeholder="Enter the product name" className="searchProduct" /> */}
              <Link to="/search">Search Products</Link>
            </li>

            {userdata && userdata.role === "admin" ? (
              <li>
                <Link to="/admin">Admin Panel</Link>
              </li>
            ) : null}

            {userdata && userdata.role === "customer" ? (
              <>
                <li>
                  <Link to="/cart">Cart</Link>
                </li>
                <li>
                  <Link to="/order">Orders</Link>
                </li>
              </>
            ) : null}

            {userdata ? (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};