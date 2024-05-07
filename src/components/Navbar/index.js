import React from "react";
import "./index.css";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const Navbar = (props) => {
  const onLogOut = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  const onArrowButton = () => {
    window.history.back();
  };

  return (
    <nav>
      <div>
        <button className="add-button" onClick={onArrowButton}>
          <IoMdArrowRoundBack />
        </button>
        <h1>{props.title}</h1>
      </div>
      <button onClick={onLogOut}>Logout</button>
    </nav>
  );
};

export default Navbar;
