import "../OrderPages/OrderPage.css";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminNavBar } from "./AdminNavBar";

export const UpdateStatus = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  let token = Cookie.get("token");
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }

  const getOrders = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/orders/all", {
        headers: { Authorization: `Authorization: Bearer ${token}` },
      });
      setOrders(response.data.data);
    } catch (err) {
      setOrders([]);
      setErrorMessage(<p>{err.response.data.error}</p>);
    }
  };

  const update = async (order_id, value) => {
    const confirmed = window.confirm(
      `Do you want to update the order status to ${value}`
    );
    if (confirmed) {
      try {
        const response = await axios.patch(
          `http://localhost:7000/api/orders/${order_id}/status`,
          { status: value },
          {
            headers: { Authorization: `Authorization: Bearer ${token}` },
          }
        );
        getOrders();
        alert(`Order status has been succesfully updated to: ${value}`);
      } catch (err) {
        setOrders([]);
        setErrorMessage(<p>{err.response.data.error}</p>);
      }
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
      <AdminNavBar></AdminNavBar>
      <div className="orderContainer">
        {orders.length > 0 ? (
          orders.map((order) => {
            return (
              <>
                <div key={order.id} className="orderCard">
                  <h2>Order ID: {order.id}</h2>
                  <h3>User ID: {order.user_id}</h3>
                  {order.Order_items.map((item) => {
                    return (
                      <div key={item.id} className="orderitems">
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
                    <select
                      value={order.status}
                      onChange={(e) => update(order.id, e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delievered">Delievered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
