import "./HomePage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "./Product";

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/categories");
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
      <h1>Welcome, UserName</h1>
      <div>
        {categories.length>0 ?(
        categories.map((category, index) => {
          return (
            <>
              <div key={index}>
                <h2 className="categoryHeader">{category.name}</h2>
              </div>
              <Product category= {category.name} />
            </>
          );
        })):(
          <h3 className="productTitle">No Categories Found</h3>
        )
        }
      </div>
    </>
  );
};
