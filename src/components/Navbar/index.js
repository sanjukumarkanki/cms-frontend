import React from 'react'
import './index.css'
import Cookies from 'js-cookie'


const Navbar = (props) => {

    const onLogOut = () => {
        Cookies.remove("token");
        window.location.href = "/login";
    }
    
  return (
    <nav>
        <h1>{props.title}</h1>
        <button onClick={onLogOut}>Logout</button>
    </nav>
  )
}

export default Navbar