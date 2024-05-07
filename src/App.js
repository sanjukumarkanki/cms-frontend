import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import AllLeads from "./components/AllLeads";
import Customer from "./components/Customer";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Cookies from "js-cookie";
import Navbar from "./components/Navbar";
import DaywiseFollowups from "./components/DaywiseFollowups";
import ReactContext from "./contexts";

// export const baseUrl = "https://cms-backend-4rsq.onrender.com"
// export const baseUrl = "https://cms-backend-difl.onrender.com"
export const baseUrl = "https://cms-backend-difl.onrender.com";

function App() {
  const token = Cookies.get("token");
  const [FollowupData, setFollowupData] = useState([]);
  const [filterData, setFolloupFilterData] = useState("");
  console.log(filterData);

  return (
    <ReactContext.Provider
      value={{ filterData, setFilterData: (e) => setFolloupFilterData(e) }}
    >
      <div className="lead-app-main-container">
        {token && <Sidebar />}
        <div className="lead-app-main-container__sub-container">
          {token ? (
            <Routes>
              <Route exact path="/allleads" element={<AllLeads />} />
              <Route path="/patient/:id" element={<Customer />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route
                exact
                path="/day-wise-followups"
                element={<DaywiseFollowups />}
              />
              <Route path="*" element={<Navigate to="/allleads" />} />
            </Routes>
          ) : (
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </div>
      </div>
    </ReactContext.Provider>
  );
}

export default App;
