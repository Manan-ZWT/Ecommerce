import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import "./NavBar.css";
import { logout } from "../AuthPages/Logout";

export const NavBar = () => {
  const [userdata, setUserdata] = useState([]);
  const location = useLocation();
  const fetchCookie = () => {
    const cookie = Cookie.get("userdata");
    setUserdata(cookie ? JSON.parse(cookie) : undefined);
  };
  useEffect(() => {
    fetchCookie();
  }, [location]);

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
