import "./HomePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import axios from "axios";

export const Product = (props) => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const { userdata } = useUser();
  // if (!userdata) {
  //   userdata = undefined;
  // }
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_LINK}/products?category=${props.category}`
      );
      setProducts(response.data.data.slice(0, 4));
    } catch (err) {
      console.log("Error finding products");
    }
  };

  const addToCart = async (product_id, quantity = 1) => {
    try {
      if (userdata.token) {
        const response = await axios.post(
          `${API_LINK}/cart`,
          { product_id, quantity },
          {
            headers: {
              Authorization: `Authorization: Bearer ${userdata.token}`,
            },
          }
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
      if (!userdata.token) {
        return;
      }
      const confirmDelete = window.confirm(
        "Do you want to delete the product?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(`${API_LINK}/products/${id}`, {
        headers: { Authorization: `Authorization: Bearer ${userdata.token}` },
      });

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
                src={`${API_LINK}/images/${product.image_url}`}
                alt=""
                onClick={() => {
                  navigateproduct(product.id);
                }}
              />
              <div className="productDetails">
                <h3 className="productTitle">{product.name}</h3>
                <p className="productDescription">{product.description}</p>
                <p className="productPrice">{product.price} ₹</p>

                {!userdata ? (
                  <p className="addToCart" onClick={navigatelogin}>
                    Login to add this item in cart
                  </p>
                ) : (
                  <></>
                )}
                {userdata && userdata.token && userdata.role === "customer" ? (
                  <p className="addToCart">
                    <button onClick={() => addToCart(product.id)}>
                      Add to Cart
                    </button>
                  </p>
                ) : (
                  <></>
                )}

                {userdata && userdata.token && userdata.role === "admin" ? (
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
