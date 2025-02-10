import "./HomePage.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Product = (props) => {
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
                <Link to="toCart">Add to Cart</Link>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
