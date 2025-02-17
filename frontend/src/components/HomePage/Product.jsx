import "./HomePage.css";
import { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";

export const Product = (props) => {
  const token = Cookie.get("token");
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  } else {
    userdata = undefined;
  }
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

  const navigatelogin = async () => {
    navigate(`/login`);
  };

  const navigateproduct = async (id) => {
    navigate(`/products/${id}`);
  };

  const navigateedit = (id) => {
    navigate(`/edit/${id}`, { replace: true });
  };

  const deleteProduct = async (id) => {
    try {
      if (!token) {
        return;
      }
      const confirmDelete = window.confirm(
        "Do you want to delete the product?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(
        `http://localhost:7000/api/products/${id}`,
        { headers: { Authorization: `Authorization: Bearer ${token}` } }
      );

      alert(response.data.message);
    } catch (err) {
      console.error(err.response.data.error);
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
                onClick={() => {
                  navigateproduct(product.id);
                }}
              />
              <div className="productDetails">
                <h3 className="productTitle">{product.name}</h3>
                <p className="productDescription">{product.description}</p>
                <p className="productPrice">{product.price} ₹</p>
                {token && userdata && userdata.role === "customer" ? (
                  <p className="addToCart">
                    <button onClick={() => addToCart(product.id)}>
                      Add to Cart
                    </button>
                  </p>
                ) : (
                  <></>
                )}
                {!token && !userdata ? (
                  <p className="addToCart" onClick={navigatelogin}>
                    Login to add this item in cart
                  </p>
                ) : (
                  <></>
                )}
                {token && userdata && userdata.role === "admin" ? (
                  <div className="editDiv">
                    <p className="edit">
                      <button onClick={() => navigateedit(product.id)}>
                        Edit product
                      </button>
                    </p>
                    <p className="remove">
                      <button onClick={() => deleteProduct(product.id)}>
                        Remove product
                      </button>
                    </p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
