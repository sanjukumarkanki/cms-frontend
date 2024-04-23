import React from 'react'
import './index.css'
import { Link } from 'react-router-dom'
import { AiFillBook } from "react-icons/ai";
import { FaUser } from "react-icons/fa";


const Sidebar = () => {
  return (
    <div className='sidebar'>
        <img src='	https://cionlandingpage.000webhostapp.com/otherPages/biopsyLandingPage/assets/cion-logo.webp' height={50} width={50} alt="comapny logo" />
        <div className='sidebar__options'>
            <Link to="/allleads" className='sidebar__leads-text'>
              <AiFillBook />
              <span>All Leads</span>
            </Link>
            <Link to="/allleads" className='sidebar__leads-text'>
            <FaUser />
            <span>Customer Details</span>
        </Link>
        </div>
    </div>
  )
}

export default Sidebar