import "./HomePage.css";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";

export const Product = (props) => {
  // const token = Cookie.get("token");
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/products?category=${props.category}`
      );
      setProducts(response.data.data.slice(0, 4));
    } catch (err) {
      console.log("Error finding products");
    }
  };

  const addToCart = async (product_id, quantity = 1) => {
    try {
      // Ensure token is being used dynamically
      const token = Cookie.get("token");

      // Ensure the Authorization header is set correctly
      if (token) {
        await axios.post(
          `http://localhost:7000/api/cart`,
          { product_id, quantity },
          { headers: { Authorization: `Authorization: Bearer ${token}` } }
        );
        alert("Product added to cart!");
      } else {
        console.log("No token found, please login.");
      }
    } catch (err) {
      console.log("Error inserting products into cart", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <div className="cardHolder">
        {products.map((product) => {
          return (
            <div key={product.id} className="card">
              <img
                src={`http://localhost:7000/images/${product.image_url}`}
                alt=""
              />
              <div className="productDetails">
                <h3 className="productTitle">{product.name}</h3>
                <p className="productDescription">{product.description}</p>
                <p className="productPrice">{product.price} ₹</p>
                <p className="addToCart">
                  <button onClick={() => addToCart(product.id)}>
                    Add to Cart
                  </button>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
