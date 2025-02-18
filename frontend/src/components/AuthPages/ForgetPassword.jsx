import "./Loginpage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const ForgetPassword = () => {
  const API_LINK = process.env.REACT_APP_API_LINK;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState();
  const [userotp, setUserOtp] = useState();
  const [verify, setVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_LINK}/auth/forget`, {
        email: email,
      });
      setErrorMessage("");
      setOtp(response.data.otp);
    } catch (err) {
      if (err.response.data.messsage)
        setErrorMessage(
          <>
            <p>{err.response.data.error}</p>
            <p>{err.response.data.messsage}</p>
            <Link to="/register">Register Here</Link>
          </>
        );
      else {
        setErrorMessage(err.response.data.error);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp === userotp) {
      setErrorMessage("");
      setVerify(true);
    } else {
      setErrorMessage("Please Enter a valid OTP");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password === confirmpassword) {
      try {
        const response = await axios.patch(`${API_LINK}/auth/reset`, {
          email: email,
          password: password,
        });
        setSucessMessage(
          <>
            <p>{response.data.message}</p>
          </>
        );
        setOtp(null);
        setUserOtp(null);
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        navigate("/login")
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
      setErrorMessage("");
    } else {
      setErrorMessage("Error in updating password");
    }
  };

  return (
    <div className="login-container">
      <form className="formContainer">
        <h2>Reset Password</h2>
        {!otp && !verify && (
          <>
            <div className="input-group">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="login-btn" onClick={handleForm}>
              Send OTP to your Email
            </button>
          </>
        )}

        {otp && !verify && (
          <>
            <div className="input-group">
              <input
                type="string"
                placeholder="Enter the OTP"
                onChange={(e) => setUserOtp(parseInt(e.target.value))}
              ></input>
            </div>
            <button type="submit" className="login-btn" onClick={handleVerify}>
              Verify OTP
            </button>
          </>
        )}

        {verify && (
          <>
            <div className="input-group">
              <input
                type="password"
                placeholder="Enter the password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="input-group">
              <input
                type="string"
                placeholder="Enter the confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>
            <button type="submit" className="login-btn" onClick={handleReset}>
              Reset Password
            </button>
          </>
        )}
      </form>
      {sucessMessage && <p className="success">{sucessMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};
