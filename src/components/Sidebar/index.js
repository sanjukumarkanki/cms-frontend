import React from 'react'
import './index.css'
import { Link } from 'react-router-dom'
import { AiFillBook } from "react-icons/ai";
import { FaUser } from "react-icons/fa";


const Sidebar = () => {
  return (
    <div className='sidebar'>
        <img src='	https://res.cloudinary.com/deo74k78q/image/upload/v1713869456/logo-2_1_b0yjc0.png' height={50} width={50} alt="comapny logo" />
        <div className='sidebar__options'>
            <Link to="/allleads" className='sidebar__leads-text'>
              <img src='https://res.cloudinary.com/deo74k78q/image/upload/v1713869456/Leads_1_rd4jxl.png' alt="optionBar" />
              <span>All Leads</span>
            </Link>
            <Link to="/dashboard" className='sidebar__leads-text'>
            <img src='https://res.cloudinary.com/deo74k78q/image/upload/v1714473623/dashboard_qjvacr.png' alt="" />
            <span>Folloup Dashboard</span>
        </Link>
        </div>
    </div>
  )
}

export default Sidebar