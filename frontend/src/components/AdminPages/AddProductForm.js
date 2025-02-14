import "../AuthPages/Loginpage.css";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export const AddProduct = () => {
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
  const [categories, setCategories] = useState([]);

  const handleForm = (e) => {
    e.preventDefault();
    addProduct();
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

  const addProduct = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category_id", category_id);
    if (imageUrl) formData.append("uploaded_file", imageUrl);
    try {
      const response = await axios.post(
        `http://localhost:7000/api/products`,
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
  }, []);

  return (
    <>
      {userdata && userdata.role === "admin" ? (
        <div className="login-container">
          <form className="formContainer" onSubmit={handleForm}>
            <h2>Add Product</h2>

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
            </div>

            <button type="submit" className="login-btn">
              Add Product
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
