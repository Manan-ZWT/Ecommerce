import "../HomePage/HomePage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const SearchFilters = () => {
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
      const response = await axios.get("http://localhost:7000/api/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.log("Error finding categories");
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/products?category=${formData.category}&min_price=${formData.minPrice}&max_price=${formData.maxPrice}`
      );
      setProducts(response.data.data);
    } catch (err) {
      setProducts([]);
      console.log("Error finding products");
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
      <h2>Search Products By Filters</h2>
      <div>
        <form onSubmit={handleForm}>
          <label htmlFor="maxPrice">Max Price:</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <label htmlFor="minPrice">Min Price:</label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

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

          <button type="submit">Search</button>
        </form>
      </div>

      <div className="cardHolder">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="card">
              <img
                src={`http://localhost:7000/images/${product.image_url}`}
                alt={product.name}
              />
              <div className="productDetails">
                <h3 className="productTitle">{product.name}</h3>
                <p className="productDescription">{product.description}</p>
                <p className="productPrice">{product.price} ₹</p>
                <p className="addToCart">
                  <Link to="toCart">Add to Cart</Link>
                </p>
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
