import "./OrderPage.css";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { Product } from "./Product";

export const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  let token = Cookie.get("token");
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }
  const getOrders = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/orders", {
        headers: { Authorization: `Authorization: Bearer ${token}` },
      });
      setOrders(response.data.data);
    } catch (err) {
      setOrders([]);
      setErrorMessage(<p>{err.response.data.error}</p>);
    }
  };

  const navigateproduct = async (id) => {
    navigate(`/products/${id}`);
  };

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <>
      <div className="orderContainer">
        {orders.length > 0 ? (
          orders.map((order, index) => {
            return (
              <>
                <div key={index} className="orderCard">
                  <h2>Order ID: {order.id}</h2>
                  {order.Order_items.map((item, index) => {
                    return (
                      <div className="orderitems">
                        <img
                          src={`http://localhost:7000/images/${item.Product.image_url}`}
                          alt=""
                          onClick={() => {
                            navigateproduct(item.Product.id);
                          }}
                        ></img>
                        <p>{item.Product.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.quantity * item.price}</p>
                      </div>
                    );
                  })}
                  <div className="status">
                    <h2>Total Price: {order.total_price}</h2>
                    <p>Order Status: {order.status}</p>
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <h3>No Orders Found</h3>
        )}
      </div>
      {errorMessage && <h2>{errorMessage}</h2>}
    </>
  );
};
