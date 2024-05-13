import React, { useRef, useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
import { baseUrl } from "../../App";

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

  // const onLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       userDetails.current.email,
  //       userDetails.current.password
  //     );
  //     // localStorage.setItem("user", userCredential.user.email);
  //     Cookies.set("token", userCredential.user.accessToken, { expires: 30 });
  //     window.location.replace("/allleads");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails.current),
      };
      const makeLoginRequest = await fetch(`${baseUrl}/signin`, options);
      const response = await makeLoginRequest.json();
      if (makeLoginRequest.ok) {
        console.log(response);
        Cookies.set("token", response.token, { expires: 30 });
        window.location.replace("/alldetails");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div class="login-container__form-container">
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
