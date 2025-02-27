import "./HomePage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "./Product";
import { useUser } from "../../Context/UserContext.js";

export const HomePage = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const { userdata } = useUser();
  const [categories, setCategories] = useState([]);

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
  }, []);
  return (
    <>
      {userdata?.name === undefined ? (
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
