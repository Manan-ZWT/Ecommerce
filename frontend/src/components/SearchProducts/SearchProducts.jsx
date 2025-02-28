import "../HomePage/HomePage.css";
import "./SearchProducts.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import axios from "axios";

export const SearchFilters = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const { userdata } = useUser();
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
  });
  const [products, setProducts] = useState([]);

  const handleForm = (e) => {
    e.preventDefault();
    setFormData({
      minPrice,
      maxPrice,
      category,
    });
    getProducts();
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_LINK}/categories`);
      setCategories(response.data.data);
    } catch (err) {
      console.log("Error finding categories");
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_LINK}/products?category=${formData.category}&min_price=${formData.minPrice}&max_price=${formData.maxPrice}`
      );
      setProducts(response.data.data);
    } catch (err) {
      setProducts([]);
      console.log("Error finding products");
    }
  };

  const addToCart = async (product_id, quantity = 1) => {
    try {
      if (userdata.token) {
        await axios.post(
          `${API_LINK}/cart`,
          { product_id, quantity },
          {
            headers: {
              Authorization: `Authorization: Bearer ${userdata.token}`,
            },
          }
        );
        alert("Product added to cart!");
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
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err.response.data.error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts();
  }, [formData]);

  return (
    <div>
      <div className="filterContainer">
        <h2>Search Products By Filters</h2>
        <form className="filterForm" onSubmit={handleForm}>
          <div className="filterGroup">
            <label htmlFor="maxPrice">Max Price:</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="filterGroup">
            <label htmlFor="minPrice">Min Price:</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="filterGroup">
            <label htmlFor="category">Category:</label>
            <select
              value={category}
              id="category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="filterButton">
            Search
          </button>
        </form>
      </div>

      <div className="cardHolder">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="card">
              <img
                src={`${API_LINK}/images/${product.image_url}`}
                alt={product.name}
                onClick={() => {
                  navigateproduct(product.id);
                }}
              />
              <div className="productDetails">
                <h3 className="productTitle">{product.name}</h3>
                <p className="productDescription">{product.description}</p>
                <p className="productPrice">{product.price} ₹</p>
                {userdata && userdata.token && userdata.role === "customer" ? (
                  <p className="addToCart">
                    <button onClick={() => addToCart(product.id)}>
                      Add to Cart
                    </button>
                  </p>
                ) : (
                  <></>
                )}
                {!userdata ? (
                  <p className="addToCart" onClick={navigatelogin}>
                    Login to add this item in cart
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
          ))
        ) : (
          <h3 className="productTitle">No Products Found</h3>
        )}
      </div>
    </div>
  );
};
