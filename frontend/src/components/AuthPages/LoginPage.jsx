import "./Loginpage.css";
import Cookie from "js-cookie";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const LoginForm = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    login();
  };

  const login = async () => {
    try {
      const response = await axios.post(
        `${API_LINK}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, 
        }
      );

      if (response.data.message === "Succesfully login") {
        navigate("/");
      }
    } catch (err) {
      if (err.status === 404)
        setErrorMessage(
          <>
            <p>{err.response.data.error}</p>
            <p>{err.response.data.messsage}</p>
            <Link to="/register">Register Here</Link>
          </>
        );
      else {
        setErrorMessage(err.response);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="formContainer" onSubmit={handleForm}>
        <h2>Login to Your Account</h2>
        <div className="input-group">
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="pass"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <Link to="/reset" className="error">
          Forget Password
        </Link>
        <p className="registerlink">
          New User? <br />
          <Link to="/signup">Register to become a new user</Link>
        </p>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};
