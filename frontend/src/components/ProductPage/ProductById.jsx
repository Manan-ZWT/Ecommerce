import "./ProductById.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

export const ProductById = () => {
  const token = Cookie.get("token");
  const [userdata, setUserdata] = useState([]);
  const navigate = useNavigate();
  const fetchCookie = () => {
    const cookie = Cookie.get("userdata");
    setUserdata(cookie ? JSON.parse(cookie) : undefined);
  };

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/products/${id}`
      );
      setProduct(response.data.data);
    } catch (err) {
      console.log(err.response.data.error);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
    } catch (err) {
      console.error(err.response.data.error);
    }
  };

  const navigateedit = (id) => {
    navigate(`/edit/${id}`, { replace: true });
  };

  useEffect(() => {
    getProduct();
    fetchCookie();
  }, [id]);

  return (
    <>
      <div>
        {product ? (
          <div className="productDiv">
            <img
              src={`http://localhost:7000/images/${product.image_url}`}
              alt=""
            />
            <div className="productDetails">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">{product.price} ₹</p>
              {token && userdata && userdata.role === "customer" ? (
                <button
                  onClick={() => addToCart(product.id)}
                  className="addtocart"
                >
                  Add to Cart
                </button>
              ) : (
                <p className="addToCart">Login to add this item in cart</p>
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
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};
