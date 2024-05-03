import React from 'react'
import './index.css'
import Cookies from 'js-cookie'
import { FaArrowLeft } from "react-icons/fa";


const Navbar = (props) => {

    const onLogOut = () => {
        Cookies.remove("token");
        window.location.href = "/login";
    }

    const onArrowButton = () => {
      window.history.back();
    }
    
  return (
    <nav>
        <div>
          <img src='https://res.cloudinary.com/deo74k78q/image/upload/v1713891289/Go_Back_pnxxyu.png' onClick={onArrowButton} alt="arrow goback1" className='arrow-goback1' />
          <h1>{props.title}</h1>
        </div>
        <button onClick={onLogOut}>Logout</button>
    </nav>
  )
}

export default Navbar