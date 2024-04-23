import React from "react";

const GlobalStateContext = React.createContext({
    allLeadsList : [],
    setAllLeadsList : () => {},
    addnewRow : [],
    setAddNewRow : () => {},
})

export default GlobalStateContext