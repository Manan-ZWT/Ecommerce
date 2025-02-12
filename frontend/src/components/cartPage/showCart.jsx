import "./ShowCart.css";
// import "../HomePage/HomePage.css";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";

export const ShowCart = () => {
  const token = Cookie.get("token");
  const [cart, setCart] = useState([]);
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }
  const getCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/cart", {
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
        `http://localhost:7000/api/cart/${id}`,
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
      const response = await axios.delete(
        `http://localhost:7000/api/cart/${id}`,
        {
          headers: { Authorization: `Authorization: Bearer ${token}` },
        }
      );
      alert(response.data.message);
      getCartItems();
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post("http://localhost:7000/api/orders", {
        headers: { Authorization: `Authorization: Bearer ${token}` },
      });
      alert(response.data.message);
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
                  src={`http://localhost:7000/images/${item.Product.image_url}`}
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
    </>
  );
};
