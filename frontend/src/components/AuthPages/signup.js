import "./Loginpage.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    signup();
  };

  const signup = async () => {
    try {
      const response = await axios.post(
        `${API_LINK}/auth/registration`,
        {
          first_name:fname,
          last_name:lname,
          email,
          password,
        }
      );

      if (response.data.message === "You have been succesfully registered") {
        navigate("/login");
      }
    } catch (err) {
      setErrorMessage(err.response.data.error);
    }
  };

  return (
    <div className="login-container">
      <form className="formContainer" onSubmit={handleForm}>
        <h2>Register to become a member</h2>
        <div className="input-group">
          <input
            type="text"
            id="fname"
            placeholder="Enter your First name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            id="lname"
            placeholder="Enter your Last name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />
        </div>
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
          Register
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};
