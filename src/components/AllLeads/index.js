import React from "react";
import { useEffect, useState } from "react";

import { Skeleton } from "primereact/skeleton";

import "./index.css";

import LeadTable from "../LeadTable";
import { toast } from "react-toastify";
import Navbar from "../Navbar";
import { baseUrl } from "../../App";

const AllLeads = () => {
  return (
    <section className="leads-main-container">
      <Navbar title="All Leads" />
      <LeadTable />
    </section>
  );
};

export default AllLeads;
