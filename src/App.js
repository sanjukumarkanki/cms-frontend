import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import AllLeads from "./components/AllLeads";
import Customer from "./components/Customer";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Cookies from "js-cookie";
import DaywiseFollowups from "./components/DaywiseFollowups";
import ReactContext from "./contexts";

export const baseUrl = "https://cms-backend-difl.onrender.com";

// export const baseUrl = "http://localhost:3003";

// To get the stored token from browser
export const token = Cookies.get("token");
// To pass the headers in each get api call
export const getRequestHeaders = {
  method: "GET",
  headers: {
    authorization: `BEARER ${token}`,
  },
};
// To pass the headers in each POST,PUT api call
export const getPostRequestHeaders = {
  headers: {
    "Content-Type": "application/json",
    authorization: `BEARER ${token}`,
  },
};

function App() {
  const [FollowupData, setFollowupData] = useState([]);

  return (
    <ReactContext.Provider
      value={{
        FollowupData,
        setFollowupData: (e) => setFollowupData(e),
      }}
    >
      <div className="lead-app-main-container">
        {token && <Sidebar />}
        <div className="lead-app-main-container__sub-container">
          {token ? (
            <Routes>
              {/* All routes will display only when the user have token  */}
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
              {/* If the user does'nt have any token than it will redirect to the login
            or If the user try to acess undefined route */}
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
