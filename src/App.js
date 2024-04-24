import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import Home from './components/Home';
import './App.css';
import Sidebar from './components/Sidebar';
import AllLeads from './components/AllLeads';
import GlobalStateContext from './contexts';
import Customer from './components/Customer';

function App() {

  return (
    <GlobalStateContext.Provider
      value={{
        allLeadsList: []
      }}
    >
      <div className='lead-app-main-container'>
        <Sidebar />
        <div className='lead-app-main-container__sub-container'>
          <Routes>
            <Route exact  path='/allleads' element={<AllLeads />} /> 
            <Route  path='/patient/:id' element={<Customer/>} />
          </Routes>
        </div>
      </div>
    </GlobalStateContext.Provider>
  );
}

export default App;
