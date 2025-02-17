import "./HomePage.css";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { Product } from "./Product";

export const HomePage = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const [categories, setCategories] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const fetchCookie = () => {
    const cookie = Cookie.get("userdata");
    setUserdata(cookie ? JSON.parse(cookie) : undefined);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_LINK}/categories`);
      setCategories(response.data.data);
    } catch (err) {
      setCategories([]);
      console.log("Error finding categories");
    }
  };
  useEffect(() => {
    getCategories();
    fetchCookie();
  }, []);
  return (
    <>
      {userdata === undefined ? (
        <h1>Welcome, Guest</h1>
      ) : (
        <h1>Welcome,{userdata.name}</h1>
      )}
      <div>
        {categories.length > 0 ? (
          categories.map((category) => {
            return (
              <>
                <div key={category.id}>
                  <h2 className="categoryHeader">{category.name}</h2>
                </div>
                <Product category={category.name} />
              </>
            );
          })
        ) : (
          <h3 className="productTitle">No Categories Found</h3>
        )}
      </div>
    </>
  );
};
