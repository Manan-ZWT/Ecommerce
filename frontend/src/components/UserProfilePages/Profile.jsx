import "../AuthPages/Loginpage.css";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export const Updateuser = () => {
  const API_LINK = process.env.API_LINK;
  const token = Cookie.get("token");
  let userdata = Cookie.get("userdata");
  if (userdata) {
    userdata = JSON.parse(userdata);
  }
  const [user, setUser] = useState(userdata);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleForm = (e) => {
    e.preventDefault();
    update();
  };

  const update = async () => {
    try {
      const response = await axios.patch(
        `${API_LINK}/users/profile`,
        {
          first_name: fname,
          last_name: lname,
          email,
          // password,
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

      const updateData = {
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
      };
      Cookie.set("userdata", JSON.stringify(updateData));
      setUser(updateData);
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
      {user ? (
        <div className="login-container">
          <form className="formContainer" onSubmit={handleForm}>
            <h2>User Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <h2>Update your profile</h2>

            <div className="input-group">
              <input
                type="text"
                id="fname"
                placeholder="Enter your First name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                id="lname"
                placeholder="Enter your Last name"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                id="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* <div className="input-group">
              <input
                type="password"
                id="pass"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}

            <button type="submit" className="login-btn">
              Update Profile
            </button>
            {sucessMessage && <p className="success">{sucessMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
          </form>
        </div>
      ) : (
        <h3>Please log in to update your profile</h3>
      )}
    </>
  );
};
