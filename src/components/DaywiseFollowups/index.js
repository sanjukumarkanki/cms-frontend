import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
  Fragment,
} from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import Navbar from "../Navbar";
import ExcelComponent from "../ExcelComponent";
import { FaSearch } from "react-icons/fa";
import { baseUrl } from "../../App";
// import DatePicker from "react-date-picker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { styled } from "@mui/material/styles";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Calendar } from "primereact/calendar";
import dayjs from "dayjs";
import { StyledEngineProvider } from "@mui/material/styles";
import BasicDatePicker from "./Demo";
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const date = currentDate.getDate();
const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
  date < 10 ? "0" + date : date
}`;

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const DaywiseFollowups = () => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "10rem" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [defaultDate, setDefaultDate] = useState("2024-05-02");
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "id",
    },
    {
      field: "callerName",
    },
    {
      field: "coachNotes",
    },
    {
      field: "date",
    },
    {
      field: "stage",
      flex: 1,
    },
  ]);
  const [filterData, setFilterData] = useState();

  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((formatDate) => {
    console.log(formatDate, "dfdf");
    fetch(`${baseUrl}/day-wise-followups/${formatDate}`)
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const onHandleDateChange = (e) => {
    if (e.target.value !== "") {
      setDefaultDate(e.target.value);
      onGridReady(e.target.value);
    }
  };

  const paginationPageSizeSelector = [5, 50, 100, 200, 500];

  return (
    <div className="day-wise-container">
      <Navbar title="Day Wise Followups" />
      {/* Followups Table */}
      <div className="day-wise-container__sub-container">
        <div>
          <input
            type="date"
            value={defaultDate}
            onChange={onHandleDateChange}
          />
          <ExcelComponent data={filterData} filename="followup_data.xlsx" />
        </div>
        <div className="day-wise-container">
          <div style={containerStyle}>
            <div style={gridStyle} className={"ag-theme-quartz-dark"}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onGridReady={() => onGridReady("2024-05-02")}
                pagination={true}
                paginationPageSize={5}
                paginationPageSizeSelector={paginationPageSizeSelector}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaywiseFollowups;
