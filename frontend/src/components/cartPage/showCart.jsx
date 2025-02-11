import "../HomePage/HomePage.css";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";

export const ShowCart = () => {
  const [cart, setCart] = useState([]);
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }
  const getCartItems = async () => {
    try {
      const token = Cookie.get("token");
      const response = await axios.get(
        "http://localhost:7000/api/cart",
        { headers: { Authorization: `Authorization: Bearer ${token}` } }
      );
      setCart(response.data.data);
    } catch (err) {
      setCart([]);
      console.log("Error finding items in cart");
    }
  };
  useEffect(() => {
    getCartItems();
  }, []);
  return (
    <>
      <div>
        {cart.length > 0 ? (
          cart.map((item, index) => {
            return (
              <>
                <div key={index}>
                  <h2 className="categoryHeader">{item.Product.name}</h2>
                </div>
              </>
            );
          })
        ) : (
          <h3 className="productTitle">No Items Found</h3>
        )}
      </div>
    </>
  );
};
