import { createContext } from "react";

const ReactContext = createContext({
  filterData: "",
  setFilterData: () => {},
  onSetGridReady: () => {},
});

export default ReactContext;
