import "../AuthPages/Loginpage.css";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export const AddCategory = () => {
  const token = Cookie.get("token");
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }
  const [cname, setCname] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleForm = (e) => {
    e.preventDefault();
    addCat();
  };

  const addCat = async () => {
    try {
      const response = await axios.post(
        `http://localhost:7000/api/categories`,
        {
          name: cname
        },
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

  return (
    <>
      {userdata && userdata.role === "admin" ? (
        <div className="login-container">
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
