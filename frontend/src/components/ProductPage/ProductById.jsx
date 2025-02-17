import "./ProductById.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

export const ProductById = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
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
        `${API_LINK}/products/${id}`
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
          `${API_LINK}/cart`,
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
        `${API_LINK}/products/${id}`,
        { headers: { Authorization: `Authorization: Bearer ${token}` } }
      );

      alert(response.data.message);
    } catch (err) {
      console.error(err.response.data.error);
    }
  };

  const navigatelogin = async () => {
    navigate(`/login`);
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
              src={`${API_LINK}/images/${product.image_url}`}
              alt=""
            />
            <div className="productDetails">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">{product.price} ₹</p>
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
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
