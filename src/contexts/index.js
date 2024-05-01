import React, { createContext, useState } from "react";

const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [rowData, setRowData] = useState([]);

  return (
    <MyContext.Provider value={{ rowData, setRowData }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
