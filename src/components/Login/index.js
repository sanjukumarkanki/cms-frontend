import React, { useRef, useState } from "react";
import "./index.css";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";

const Login = () => {
  // const [value, setValue] = useState("");
  const [errorMessage, setError] = useState("");
  const userDetails = useRef({
    email: "",
    password: "",
  });

  // const handleClick = () => {
  //     signInWithPopup(auth, provider).then((result) => {
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         Cookies.set('token', credential.accessToken, {expires: 30})
  //         window.location.href = "/alldetails"
  //       }).catch((error) => {
  //         setError(error.message)
  //       });

  // }

  // useEffect(() => {
  //   setValue(localStorage.getItem("email"));
  // });

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userDetails.current.email,
        userDetails.current.password
      );
      // localStorage.setItem("user", userCredential.user.email);
      Cookies.set("token", userCredential.user.accessToken, { expires: 30 });
      window.location.replace("/allleads");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div class="form-container">
        <p class="title">Welcome back</p>
        <form class="form">
          <input
            type="email"
            required
            onChange={(e) => (userDetails.current.email = e.target.value)}
            class="input"
            placeholder="Email"
          />
          <input
            type="password"
            required
            onChange={(e) => (userDetails.current.password = e.target.value)}
            class="input"
            placeholder="Password"
          />
          <p class="page-link">
            <span class="page-link-label">Forgot Password?</span>
          </p>
          {errorMessage !== "" && (
            <p className="error-message">{errorMessage}</p>
          )}
          <button class="form-btn" onClick={onLogin}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
