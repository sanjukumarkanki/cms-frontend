import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
  useContext,
  useEffect,
} from "react";

import "./index.css";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  AutoWidthCalculator,
  Context,
  ModuleRegistry,
} from "@ag-grid-community/core";

import { baseUrl } from "../../App";
import ReactContext from "../../contexts";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const FollowupTable = (props) => {
  const { onSetGridReady } = useContext(ReactContext);

  const containerStyle = useMemo(
    () => ({ height: "8.86rem", width: "26.3rem" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  // The Followup Table Date will be assigned to This State Variable
  const [rowData, setRowData] = useState();

  // Folloup Up Table Head Names
  const [columnDefs, setColumnDefs] = useState([
    { field: "fuLead", editable: false, width: 150 },
    { field: "date" },
    {
      headerName: "Status",
      field: "status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Scheduled", "Done", "Missed", "Cancelled"],
      },
    },
    { field: "coachNotes", flex: 1 },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback(
    (params) => {
      console.log(params, "dd");
      fetch(`${baseUrl}/patient-followups/${props.leadId}`)
        .then((resp) => resp.json())
        .then((data) => setRowData(data));
    },
    [onSetGridReady]
  );

  useEffect(() => {
    onGridReady();
  }, []);

  const handleCellEdit = useCallback((event) => {
    const { data } = event;
    // This condition checks whether selected followup statsu is Missed or not
    if (event.colDef.field === "date" && data.status === "Missed") {
      alert("You can't change the date when the status is missed");
    }
    // This condition checks whether the editing field is date or not
    if (event.colDef.field === "date") {
      const checkDate = new Date(event.newValue);
      // To Check the selected date is sunday or not
      if (checkDate.getDay() === 0) {
        alert("You Can't Change the date on sunday");
        onGridReady();
        return;
      }
    }

    // To update all Cell Fields This fucntion will be called
    const updateFollowupLead = async () => {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.leadId,
          field: event.colDef.field,
          value: event.newValue,
          followupId: data.followupId,
          leadStage: data.leadStage,
        }),
      };

      try {
        const fetchRequest = await fetch(
          `${baseUrl}/update-followup-lead`,
          options
        );
        if (!fetchRequest.ok) {
          throw new Error("Failed to update lead");
        } else {
          toast.success("Updated Successfully");
          onGridReady();
        }
      } catch (err) {
        toast.error("Update Unsuccessful.");
      }
    };

    updateFollowupLead();
  }, []);

  return (
    <ReactContext.Provider
      value={{ rowData, onSetGridReady: (params) => onGridReady() }}
    >
      <div style={containerStyle}>
        <div style={gridStyle} className={"ag-theme-quartz-dark"}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressMenuHide={true}
            onGridReady={onGridReady}
            suppressRowClickSelection={true}
            onCellValueChanged={handleCellEdit}
          />
        </div>
      </div>
    </ReactContext.Provider>
  );
};

export default FollowupTable;
