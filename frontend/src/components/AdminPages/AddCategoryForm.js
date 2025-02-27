import "../AuthPages/Loginpage.css";
import { useUser } from "../../Context/UserContext";
import { useState, useEffect } from "react";
import { AdminNavBar } from "./AdminNavBar";
import axios from "axios";

export const AddCategory = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const { userdata } = useUser();
  const [cname, setCname] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);

  const handleForm = (e) => {
    e.preventDefault();
    addCat();
  };
  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_LINK}/categories`);
      setCategories(response.data.data);
    } catch (err) {
      setCategories([]);
      console.log("Error finding categories");
    }
  };

  const addCat = async () => {
    try {
      const response = await axios.post(
        `${API_LINK}/categories`,
        {
          name: cname,
        },
        {
          headers: { Authorization: `Authorization: Bearer ${userdata.token}` },
        }
      );
      setSucessMessage(
        <>
          <p>{response.data.message}</p>
        </>
      );
      setErrorMessage("");
      setCname("");
      getCategories();
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
    addCat();
    getCategories();
  }, []);

  return (
    <>
      <AdminNavBar></AdminNavBar>
      {userdata && userdata.role === "admin" ? (
        <div className="login-container">
          <h2>Categories</h2>
          <div className="categoryList">
            {categories.length > 0 ? (
              categories.map((category) => {
                return (
                  <h3 key={category.id} value={category.id}>
                    {category.name}
                  </h3>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <form className="formContainer" onSubmit={handleForm}>
            <h2>Add Product Category</h2>

            <div className="input-group">
              <input
                type="text"
                id="cname"
                placeholder="Enter the name of the category"
                value={cname}
                onChange={(e) => setCname(e.target.value)}
              />
            </div>
            <button type="submit" className="login-btn">
              Add Category
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
