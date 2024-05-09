import React from "react";

import "./index.css";

import LeadTable from "../LeadTable";
import Navbar from "../Navbar";

const AllLeads = () => {
  return (
    <section className="leads-main-container">
      <Navbar title="All Leads" />
      <LeadTable />
    </section>
  );
};

export default AllLeads;
