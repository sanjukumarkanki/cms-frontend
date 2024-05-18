import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";
import { getPostRequestHeaders, baseUrl } from "../../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // This function will be triggered whenver the user click on login
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "POST",
        ...getPostRequestHeaders,
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      };
      // TO hit the signin api in the backend
      const makeLoginRequest = await fetch(`${baseUrl}/signin`, options);

      if (makeLoginRequest.ok) {
        // If the login gets success than it will sent a token and that token will be stored in the frontend
        const response = await makeLoginRequest.json();
        Cookies.set("token", response.token, { expires: 30 });
        window.location.replace("/allleads");
      } else {
        const response = await makeLoginRequest.json();
        // If any error occured that error message will be shown to the user
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="applicant-container">
        <h2 className="applicant-container__h2">Applicant Login</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="applicant-email-id" className="applicant-email-id">
            Email-id:
          </label>
          <br />
          <input
            type="email"
            name="applicant-email-id"
            id="applicant-email-id"
            placeholder="Enter Your Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <br />
          <label htmlFor="applicant-password" className="applicant-password">
            Password:
          </label>
          <br />
          <input
            type="password"
            name="applicant-password"
            id="applicant-password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {error && (
            <small
              className="applicant-container__small mb-2"
              style={{ color: "red" }}
            >
              {error}
            </small>
          )}
          <br />
          <input
            className="applicant-container__submit"
            type="submit"
            value="Login"
            id="login-btn"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
