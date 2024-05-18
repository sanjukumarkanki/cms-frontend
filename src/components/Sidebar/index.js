import React from "react";
import "./index.css";
import { Link, useLocation } from "react-router-dom";
import { FaAddressCard } from "react-icons/fa";
import { FaTable } from "react-icons/fa";
import { BsDatabaseFillDown } from "react-icons/bs";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <img
        src="	https://res.cloudinary.com/deo74k78q/image/upload/v1713869456/logo-2_1_b0yjc0.png"
        height={50}
        width={50}
        alt="comapny logo"
      />
      <div className="sidebar__options">
        <Link
          to="/allleads"
          className="sidebar__leads-text"
          style={{
            backgroundColor: location.pathname === "/allleads" ? "#ae4cbe" : "",
          }}
        >
          <FaTable />

          <span>Leads</span>
        </Link>
        <Link
          to="/dashboard"
          className="sidebar__leads-text"
          style={{
            backgroundColor:
              location.pathname === "/dashboard" ? "#ae4cbe" : "",
          }}
        >
          <FaAddressCard />
          <span>Followups</span>
        </Link>
        <Link
          to="/day-wise-followups"
          style={{
            backgroundColor:
              location.pathname === "/day-wise-followups" ? "#ae4cbe" : "",
          }}
          className="sidebar__leads-text"
        >
          <BsDatabaseFillDown />
          <span>Data</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
