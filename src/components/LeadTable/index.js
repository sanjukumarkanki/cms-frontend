import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
  } from "react";

  import ConvertIntoJson from "../convertLeads";

  import './index.css'
  import { createRoot } from "react-dom/client";
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { AgGridReact } from "@ag-grid-community/react";
  import "@ag-grid-community/styles/ag-grid.css";
  import "@ag-grid-community/styles/ag-theme-quartz.css";
  import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
  import { ModuleRegistry } from "@ag-grid-community/core";
  import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
  import { SetFilterModule } from "@ag-grid-enterprise/set-filter";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SetFilterModule,
  RichSelectModule
]);
  
const LeadTable = ({isbuttonClicked}) => {
  const containerStyle = useMemo(() => ({ width: "30.07rem", height: "12.32rem" }), []);
  const [newRowAdded, setNewRowAdded] = useState(false);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%",border : 'solid 1px #802a8f' }), []);
  const [rowData, setRowData] = useState();
  const gridRef = useRef(null)

  // Table Headers 
  const [columnDefs, setColumnDefs] = useState([
    {field: "id", width: '2.49rem', editable: false,
    cellRenderer: (params) => {
      const { value } = params;
      const handleClick = () => {
        window.location.replace(`/patient/${value}`);
      };

      const cellStyle = {
        color: '#000', // Set the text color
        textDecoration: 'underline', // Add underline to the text
        cursor: 'pointer', // Change cursor to pointer on hover
      };
      return <p onClick={handleClick} style={cellStyle}>{value}</p>;
    },
  },
  { field: "coachNotes",
  cellEditor: "agLargeTextCellEditor",
  cellEditorPopup: true
},
  { field: "phoneNumber",
  filter: "agTextColumnFilter"},
  {field : "callerName", filter : true},
  { field: "patientName", filter: true },
  {
    headerName : "dateOfContact",
    field : "dateOfContact",
    filter : 'agDateColumnFilter',
  },
  {
    headerName: "leadChannel",
    field: "leadChannel",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values:  ["Web Form", "Whatsapp",
    "call","Just Dial","Walk Im", "Referral",
    "Gmb", "Social Media","Youtube"],
    },
  },
    {
      headerName: "campaign",
      field: "campaign",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["ORGANIC", "OP", "PET CT", "BIOPSY", "SURGERY", "INFLUENCER", "PEDIATRIC"],
      },
    },
    {
      headerName: "coachName",
      field: "coachName",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
      values: ["Mustafa", "Rani", "Ruthvik"],
      },
  },
    { field: "age" },
    {
      headerName: "gender",
      field: "gender",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Male", "Female", "Others"],
      },
    },
    { field: "location" },
    { field: "email" },
    { field: "typeOfCancer" },
    { field: "relationsToPatient" },
    {
      headerName: "inboundOutbound",
      field: "inboundOutbound",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Inbound", "Outbound"],
      },
    },
    {
      headerName: "relevant",
      field: "relevant",
      width : 110,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0,1],
      },
    },
    {
      headerName: "interested",
      field: "interested",
      width : 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0,1],
      },
    },
    {
      headerName: "conv",
      field: "conv",
      width : 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0,1],
      },
    },
    {
      headerName: "preOp",
      field: "preOp",
      width : 110,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0,1],
      },
    },
  {
    headerName: "level",
    field: "level",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
    values: ["Very Hot", "Hot", "Cold","Closed"],
    },
},
    
    {
      headerName: "stage",
      field: "stage",
      width : 120,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
      values: ["Lead", "Op","Diag","Ip"],
      },
  },
  ]);

  // column default settings
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
      autoSizeAllColumns : true,
        sortable: true,
        resizable: true,
    };
  }, []);

  // This function will be called when the leads data comes after suucesss fetch....
  const onGridReady = useCallback((params) => {
    params.api.autoSizeAllColumns();
    fetch("http://localhost:3003/get-leads")
      .then((resp) => resp.json())
      .then((data) => {
        ConvertIntoJson(data)
        setRowData(data)
      }
      )
      
      .catch((error) => console.log(error))
  }, []);

  const handleCellEdit = useCallback((event) => {
      const { data } = event;
      // Based on the value updating the cell
      console.log(data.id,event.colDef.field,event.newValue)
      
      const makeFetchRequest = async () => {

          const options = {
              method : "PUT",
              headers: {
                  'Content-Type': 'application/json',
              },
              body : JSON.stringify({
                  id : data.id,
                  field : event.colDef.field,
                  value : event.newValue
              })
          }
  
          try {
              const fetchRequest = await fetch("http://localhost:3003/update-lead", options);
              if (!fetchRequest.ok) {
                  throw new Error('Failed to update lead');
              }
              else{
              toast.success('Updated Successfully', {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              })
              }
          } catch(err) {
            toast.warning("Update Unsuccessful.")
          }
      }
  
      makeFetchRequest();
  
  }, []);

  // When you Click on add new row then this function will be called.....
  const handleAddRow = useCallback(() => {
    const lastRow = rowData[rowData.length - 1];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const date = currentDate.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
    // Appending the new row to the rowData
    const appendNewRow = {
      id : rowData.length + 1,
      age : 0,
      campaign : "OP",
      coachNotes : "Enter Your Note",
      conv : 0,
      email : "abc@gmail.com",
      phoneNumber : 123456789,
      callerName : "default",
      patientName : "default",
      leadChannel : "WEB FORM",
      coachName : "Ruthvik",
      gender : "Male",
      typeOfCancer : "default",
      location : "default",
      relationsToPatient : "default",
      inboundOutbound : "inbound",
      relevant : 0,
      interested : 0,
      preOp : 0,
      dateOfContact : formattedDate,
      level : "cold",
      stage : "LEAD"
    }

    console.log(appendNewRow)

    setRowData(prevData => [...prevData, appendNewRow]);

    // Updating to Database
    const updateToDatabase = async () => {
      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(appendNewRow)
        };
    
        const fetchData = await fetch("http://localhost:3003/add-lead", options);
        if (!fetchData.ok) {
          throw new Error("Failed to add lead");
        } else {
          const result = await fetchData.json();
          toast.success("Lead Added Successfully.");
          setNewRowAdded(true)
          const pageSize = gridRef.current.api.paginationGetPageSize();
          const lastRecordIndex = rowData.length - 1;
          const currentPage = gridRef.current.api.paginationGetCurrentPage(); // Get current page
          const lastRecordPage = Math.floor(lastRecordIndex / pageSize) + 1; // Page numbers are 1-based
          
          if (currentPage !== lastRecordPage) {
            gridRef.current.api.paginationGoToPage(lastRecordPage); // Navigate to the last record page
          }
        }
    
      } catch (error) {
        toast.warning("Failed To Add Lead");
      }
    };
    
    updateToDatabase()

  }, [rowData]);

  const rowClassRules = {
    'highlight-row': (params) => params.node.rowIndex === rowData.length - 1 && newRowAdded
  };

  const paginationPageSizeSelector = [5,50, 100,200,500];

  return (
    <div >
      <button className="add-button" onClick={handleAddRow}>+</button>
      <div style={containerStyle} >
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
          onGridReady={onGridReady}
          onCellValueChanged={handleCellEdit}
          ref={gridRef}
          rowClassRules={rowClassRules}
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>
      {/* Toast Message Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
      </div>
    </div>
  );
};

export default LeadTable