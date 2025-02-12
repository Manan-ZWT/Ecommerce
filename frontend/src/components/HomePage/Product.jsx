import "./HomePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";

export const Product = (props) => {
  const token = Cookie.get("token");
  const navigate = useNavigate();
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
      if (token) {
        const response = await axios.post(
          `http://localhost:7000/api/cart`,
          { product_id, quantity },
          { headers: { Authorization: `Authorization: Bearer ${token}` } }
        );
        alert(response.data.message);
      } else {
        console.log("No token found, please login.");
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const navigateproduct = async (id) => {
    navigate(`products/${id}`);
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
                onClick={() => {
                  navigateproduct(product.id);
                }}
              />
              <div className="productDetails">
                <h3 className="productTitle">{product.name}</h3>
                <p className="productDescription">{product.description}</p>
                <p className="productPrice">{product.price} ₹</p>
                {token ? (
                  <p className="addToCart">
                    <button onClick={() => addToCart(product.id)}>
                      Add to Cart
                    </button>
                  </p>
                ) : (
                  <p className="addToCart">Login to add this item in cart</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
