import React, { useCallback, useMemo, useState } from "react";
import "./index.css";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import Navbar from "../Navbar";
import ExcelComponent from "../ExcelComponent";
import { getRequestHeaders } from "../../App";
import { fetchData } from "../../ApiRoutes";

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
  const [defaultDate, setDefaultDate] = useState(formattedDate);
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

  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      filter: true,
    };
  }, []);

  // To fetch all the day-wise followups Data
  const onGridReady = useCallback(async (formatDate) => {
    try {
      const getDayWiseFollowups = await fetchData(
        `day-wise-followups/${formatDate}`,
        getRequestHeaders
      );
      setRowData(getDayWiseFollowups);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // It will exuted when the user changed the date
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
          {/* Date Input Box */}
          <input
            type="date"
            value={defaultDate}
            onChange={onHandleDateChange}
          />
        </div>
        <div className="day-wise-container">
          <div style={containerStyle}>
            <div style={gridStyle} className={"ag-theme-quartz-dark"}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onGridReady={() => onGridReady(formattedDate)}
                pagination={true}
                paginationPageSize={5}
                paginationPageSizeSelector={paginationPageSizeSelector}
                domLayout="autoHeight"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaywiseFollowups;

// <ExcelComponent data={rowData} filename="followup_data.xlsx" />
