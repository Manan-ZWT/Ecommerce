import "./ShowCart.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";

export const ShowCart = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const token = Cookie.get("token");
  const [cart, setCart] = useState([]);
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }
  const getCartItems = async () => {
    try {
      const response = await axios.get(`${API_LINK}/cart`, {
        headers: { Authorization: `Authorization: Bearer ${token}` },
      });
      setCart(response.data.data);
    } catch (err) {
      setCart([]);
      console.log("Error finding items in cart");
    }
  };

  const updateCartItems = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) {
        console.log("Quantity cannot be less than 1");
        return;
      }

      await axios.patch(
        `${API_LINK}/cart/${id}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Authorization: Bearer ${token}` },
        }
      );

      getCartItems();
    } catch (err) {
      console.log("Error updating cart item:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await axios.delete(`${API_LINK}/cart/${id}`, {
        headers: { Authorization: `Authorization: Bearer ${token}` },
      });
      alert(response.data.message);
      getCartItems();
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const placeOrder = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${API_LINK}/orders`,
        {},
        {
          headers: { Authorization: `Authorization: Bearer ${token}` },
        }
      );
      const order_id = response.data.razor_order.id;
      const user_id = response.data.user_id;
      const total_price = response.data.total_price;
      const order_items_data = response.data.order_items_data;
      const order_list = response.data.order_list;
      console.log(order_id, user_id, total_price, order_items_data, order_list);

      var options = {
        key_id: process.env.REACT_APP_D8_RAZORPAY_KEY,
        amount: response.data.razor_order.amount,
        currency: response.data.razor_order.currency,
        name: "Acme Corp",
        description: "Test Transaction",
        order_id: response.data.razor_order.id,
        handler: async function (res) {
          console.log(
            order_id,
            user_id,
            total_price,
            order_items_data,
            order_list
          );
          const response = await axios.post(
            `${API_LINK}/orders/verify`,
            {user_id,total_price, order_items_data, order_list},
            {
              headers: { Authorization: `Authorization: Bearer ${token}` },
            }
          );
          setCart([]);
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();

      getCartItems();
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const grandTotal = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * item.Product.price,
      0
    );
  };

  useEffect(() => {
    getCartItems();
  }, []);
  return (
    <>
      <div>
        {cart.length > 0 ? (
          cart.map((item) => (
            <>
              <div key={item.id} className="cartitemcontainer">
                <img
                  src={`${API_LINK}/images/${item.Product.image_url}`}
                  alt=""
                />
                <h3>{item.Product.name}</h3>
                <p>{item.Product.description}</p>
                <button
                  className="subtractButton "
                  onClick={() => updateCartItems(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <p>{item.quantity}</p>
                <button
                  className="addButton"
                  onClick={() => updateCartItems(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <p className="price">{`${
                  item.quantity * item.Product.price
                } ₹`}</p>
                <button
                  className="removeOrder"
                  onClick={() => {
                    removeItem(item.id);
                  }}
                >
                  Remove
                </button>
              </div>
            </>
          ))
        ) : (
          <h3>No Items Found</h3>
        )}
        <div className="totalContainer">
          <p>Grand Total: {grandTotal()} ₹</p>
          <button className="placeOrder" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
      <Link to="/search" className="continue">
        Continue Shopping >>>
      </Link>
    </>
  );
};
