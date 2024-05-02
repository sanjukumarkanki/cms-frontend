import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
    createContext,
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
  import { ModuleRegistry } from "@ag-grid-community/core";
  import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
  import { MyContext } from "../../contexts";
  import { FaSearch } from "react-icons/fa";
import Navbar from "../Navbar";
import { baseUrl } from "../../App";
import ExcelComponent from "../ExcelComponent";


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SetFilterModule,
  RichSelectModule
]);

  
const LeadTable = () => {
  const containerStyle = useMemo(() => ({ width: "30.07rem", height: "12.32rem" }), []);
  const [newRowAdded, setNewRowAdded] = useState(false);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%",border : 'solid 1px #802a8f' }), []);
  const [rowData, setRowData] = useState();
  const gridRef = useRef(null)

  // Table Headers 
  const [columnDefs, setColumnDefs] = useState([
    {field: "id", width: 90, editable: false,
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
  { field: "phoneNumber",
  filter: "agTextColumnFilter"},
  {field : "callerName", filter : true},
  { field: "patientName", filter: true },
  {
    headerName : "Date Of Contact",
    field : "dateOfContact",
    filter : 'agDateColumnFilter',
    editable : false
  },
  {
    headerName: "Lead Channel",
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
    { field: "coachNotes",
    cellEditor: "agLargeTextCellEditor",
    cellEditorPopup: true
  },
    {
      headerName: "Coach Name",
      field: "coachName",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
      values: ["Mustafa", "Rani", "Ruthvik"],
      },
  },
    { field: "age" },
    {
      headerName: "Gender",
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
      headerName: "Inbound Outbound",
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
      headerName: "Conv",
      field: "conv",
      width : 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0,1],
      },
    },
    {
      headerName: "Pre Op",
      field: "preOp",
      width : 110,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0,1],
      },
    },
  {
    headerName: "Level",
    field: "level",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
    values: ["Very Hot", "Hot", "Cold","Closed"],
    },
},
    
    {
      headerName: "Stage",
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
      suppressColumnsToolPanel: true,
  
    };
  }, []);

  // This function will be called when the leads data comes after suucesss fetch....
  const onGridReady = useCallback((params) => {
    // params.api.autoSizeAllColumns();
    fetch(`${baseUrl}/get-leads`)
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data)
        
      }
      )
      .catch((error) => console.log(error))
  }, []);


  const insertDataIntoFollowupTable = async (appendNewRow, stageType) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: appendNewRow?.id, // Ensure rowData is defined and contains the 'id' property
          stage: appendNewRow?.stage, // Ensure appendNewRow is defined and contains the 'stage' property
        })
      };
      const fetchData = await fetch(`${baseUrl}/add-followup`, options);
      if (!fetchData.ok) {
        throw new Error("Failed to add followup");
      } else {
        const result = await fetchData.json();
        toast.success("New Follow Up Added Successfully");
        if(stageType === "firstTime"){
          updateToDatabase(appendNewRow);
        }else{
          makeFetchRequest({id : appendNewRow.id, field : appendNewRow.field, newValue : appendNewRow.stage })
        }
      }
    } catch (error) {
      toast.error("This lead Stage Already Exists");
      onGridReady()
    }
  }
  

  const makeFetchRequest = async (bodyData) => {
  
    const options = {
        method : "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({
            id : bodyData.id,
            field : bodyData.field,
            value :bodyData.newValue
        })
    }

    try {
        const fetchRequest = await fetch(`${baseUrl}/update-lead`, options);
        if (!fetchRequest.ok) {
            throw new Error('Failed to update lead');
        }
        else{
          toast.success('Updated Successfully');
        }
    } catch(err) {
      toast.error("Update Unsuccessful.")
    }
  }



  const updateToDatabase = async (appendNewRow) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appendNewRow)
      };
      const fetchData = await fetch(`${baseUrl}/add-lead`, options);
      if (!fetchData.ok) {
        throw new Error("Failed to add lead");
      } else {
        const result = await fetchData.json();
        toast.success("New Lead Added Successfully");
        onGridReady()
        setNewRowAdded(true)
        setRowData(prevData => [...prevData, appendNewRow]);
      }
  
    } catch (error) {
      toast.error("Failed To Add Lead");
    }
  };


  const handleCellEdit = useCallback((event) => {
    const { data, oldValue,newValue } = event;
    if(event.colDef.field === "stage"){
       if(oldValue === "Op" && newValue === "Lead" ){
        alert("This stage already done")
        onGridReady()
      }else if((oldValue === "Diag") && (newValue === "Op" || newValue === "Lead")){
        alert("This stage already done")
        onGridReady()
      }else if((oldValue === "Ip") && (newValue === "Lead" || newValue === "Op" || newValue === "Diag")){
        alert("This stage already done")
        onGridReady()
      }else{
      const appendNewRow = {
        id : data.id,
        stage : event.newValue,
        field : event.colDef.field
      }
        insertDataIntoFollowupTable(appendNewRow)
      }
    }
    
    else{
          makeFetchRequest({id : data.id, field : event.colDef.field, newValue : event.newValue})
    }

}, []);

  

  // When you Click on add new row then this function will be called.....
  const handleAddRow = useCallback(() => {
    const lastRow = rowData[rowData.length - 1];
    const currentDate = new Date();
    if(currentDate.getDay() === "0"){
      alert("Today Is Sunday")
    }else{
      const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const date = currentDate.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
    const appendNewRow = {
      id : rowData.length + 1,
      age : 0,
      campaign : "Op",
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
      stage : "Lead"
    }
    insertDataIntoFollowupTable(appendNewRow, 'firstTime')
    }
    

  }, [rowData]);


  const rowClassRules = {
    'highlight-row': (params) => params.node.rowIndex === 0 && newRowAdded
  };

  
  const paginationPageSizeSelector = [5,50, 100,200,500];


  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value,
    );
  }, []);


  function navigateToNextCell(params) {
    const { nextCellPosition, key } = params;

    if (nextCellPosition) {
        const { rowIndex, column } = nextCellPosition;

        gridRef.current.api.ensureIndexVisible(rowIndex); // Ensure the row is visible
        gridRef.current.api.setFocusedCell(rowIndex, column.colId); // Set focus to the cell
        gridRef.current.api.startEditingCell({
            rowIndex: rowIndex,
            colKey: column.colId,
            keyPress: key, // Pass the key pressed to the editing cell method
        });
    }
}



  return (

      <div style={{padding : "0.5rem"}}>        
          <div style={containerStyle} > 
                <div className="example-wrapper">
                        <div className="example-header">
                            <input
                              type="text"
                              id="filter-text-box"
                              placeholder="Filter..."
                              onInput={onFilterTextBoxChanged}
                            />
                            <FaSearch className="input-icon" />
                        </div>
                        <div className="download-add-btn-container">
                          <button className="add-button" onClick={handleAddRow}>+</button>
                          <ExcelComponent  data={rowData} filename="my_data.xlsx" />
                        </div>
                </div>

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
                    suppressRowClickSelection={true}
                    paginationPageSize={5}
                    suppressMenuHide={true}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    navigateToNextCell={navigateToNextCell}
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
                    draggable
                    pauseOnHover
                    theme="dark"
                  />
          </div>
      </div>
  );
};

export default LeadTable
