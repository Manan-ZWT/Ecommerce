import "../OrderPages/OrderPage.css";
import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminNavBar } from "./AdminNavBar";

export const UpdateStatus = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { userdata } = useUser();
  const getOrders = async () => {
    try {
      const response = await axios.get(`${API_LINK}/orders/all`, {
        headers: { Authorization: `Authorization: Bearer ${userdata.token}` },
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
          `${API_LINK}/orders/${order_id}/status`,
          { status: value },
          {
            headers: { Authorization: `Authorization: Bearer ${userdata.token}` },
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
                          src={`${API_LINK}/images/${item.Product.image_url}`}
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
