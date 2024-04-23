import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import Home from './components/Home';
import './App.css';
import Sidebar from './components/Sidebar';
import AllLeads from './components/AllLeads';
import GlobalStateContext from './contexts';
import Customer from './components/Customer';

function App() {
  // Define updateLeads and addNewRow functions
  const updateLeads = () => {
    // Implement logic to update leads
  };

  const addNewRow = () => {
    // Implement logic to add a new row
  };

  return (
    <GlobalStateContext.Provider
      value={{
        allLeadsList: [],
        setAllLeadsList: updateLeads,
        setAddNewRow: addNewRow
      }}
    >
      <div className='lead-app-main-container'>
        <Sidebar />
        <div className='lead-app-main-container__sub-container'>
          <Routes>
            <Route path='/' element={<Home />} /> 
            <Route exact  path='/allleads' element={<AllLeads />} /> 
            <Route exact path='/patient/:id' element={<Customer/>} />
          </Routes>
        </div>
      </div>
    </GlobalStateContext.Provider>
  );
}

export default App;
