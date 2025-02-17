import "../AuthPages/Loginpage.css";
import { useParams } from "react-router-dom";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export const UpdateProduct = () => {
  const { id } = useParams();
  const token = Cookie.get("token");
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleForm = (e) => {
    e.preventDefault();
    updateProduct();
  };

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/products/${id}`,
        { headers: { Authorization: `Authorization: Bearer ${token}` } }
      );
      const productData = response.data.data;
      setProduct(productData);
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setStock(productData.stock);
      setCategory_id(productData.category_id);
      setImageUrl(productData.image_url);
    } catch (err) {
      setProduct([]);
      console.log("Error finding product");
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/categories");
      setCategories(response.data.data);
    } catch (err) {
      setCategories([]);
      console.log("Error finding categories");
    }
  };

  const updateProduct = async () => {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (description) formData.append("description", description);
    if (price) formData.append("price", price);
    if (stock) formData.append("stock", stock);
    if (category_id) formData.append("category_id", category_id);
    if (imageUrl) formData.append("uploaded_file", imageUrl);
    try {
      const response = await axios.patch(
        `http://localhost:7000/api/products/${id}`,
        formData,
        {
          headers: { Authorization: `Authorization: Bearer ${token}` },
        }
      );
      setSucessMessage(
        <>
          <p>{response.data.message}</p>
        </>
      );
      setErrorMessage("");
    } catch (err) {
      setSucessMessage("");
      if (err.response.data.message)
        setErrorMessage(
          <>
            <p>{err.response.data.error}</p>
            <p>{err.response.data.message}</p>
          </>
        );
      else {
        setErrorMessage(err.response.data.error);
      }
    }
  };

  useEffect(() => {
    getCategories();
    getProduct();
  }, []);

  return (
    <>
      {userdata && userdata.role === "admin" ? (
        <div className="login-container">
          <form className="formContainer" onSubmit={handleForm}>
            <h2>Update Product</h2>

            <div className="input-group">
              <input
                type="text"
                id="name"
                placeholder="Enter the name of the product"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                id="description"
                placeholder="Enter the description for the product"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="number"
                id="price"
                placeholder="Enter the price for the product"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="number"
                id="stock"
                placeholder="Enter the stock for the product"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="input-group">
              <select
                id="category_id"
                value={category_id}
                onChange={(e) => setCategory_id(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
            </div>

            <div className="input-group">
              <input
                type="file"
                id="imageUrl"
                name="uploaded_file"
                placeholder="Upload the image for the product"
                onChange={(e) => setImageUrl(e.target.files[0])}
              />
              <img
                src={`http://localhost:7000/images/${product.image_url}`}
                alt=""
              />
            </div>

            <button type="submit" className="login-btn">
              Update Product
            </button>
            {sucessMessage && <p className="success">{sucessMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
          </form>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
