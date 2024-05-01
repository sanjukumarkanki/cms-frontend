import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
  useContext,
} from "react";



import './index.css'
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { AutoWidthCalculator, ModuleRegistry } from "@ag-grid-community/core";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
ModuleRegistry.registerModules([
ClientSideRowModelModule,
SetFilterModule,
RichSelectModule
]);



const FollowupTable = (props) => {
  const containerStyle = useMemo(() => ({ height: "8.86rem", width : '26.3rem'  }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();

  const [columnDefs, setColumnDefs] = useState([
    {    field : "fuLead", editable : false, width : 150},
    { field: "date" },
    {
      headerName: "Status",
      field: "status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
      values: ["Scheduled", "Booked", "Missed", "Cancelled"],
      },
  },
    { field: "coachNotes", flex : 1 },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,

    };
  }, []);

  
  const onGridReady = useCallback((params) => {
    fetch(`http://localhost:3003/patient-followups/${props.leadId}`)
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);


  const handleCellEdit = useCallback((event) => {
    const { data } = event;
    console.log(data)

    if(event.colDef.field === "date" && data.status === "Missed"){
      alert("You can't change the date when the status is missed")
    }

    const updateFollowupLead =  async () => {
          const options = {
            method : "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                id : props.leadId,
                field : event.colDef.field,
                value :event.newValue,
                followupId : data.followupId,
                leadStage : data.leadStage
            })
        }
  
    try {
        const fetchRequest = await fetch("http://localhost:3003/update-followup-lead", options);
        if (!fetchRequest.ok) {
            throw new Error('Failed to update lead');
        }
        else{
          toast.success('Updated Successfully');
          onGridReady()
        }
    } catch(err) {
      toast.error("Update Unsuccessful.")
    }
    }

    updateFollowupLead()

}, []);

  
  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className={
          "ag-theme-quartz-dark"
        }
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressMenuHide={true}
          onGridReady={onGridReady}
          onCellValueChanged={handleCellEdit}
        />
      </div>
    </div>
  );



};

export default FollowupTable