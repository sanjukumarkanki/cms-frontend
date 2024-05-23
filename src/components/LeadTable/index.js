import React, { useCallback, useMemo, useRef, useState } from "react";

import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import { FaSearch } from "react-icons/fa";
import { getPostRequestHeaders, getRequestHeaders } from "../../App";
import ExcelComponent from "../ExcelComponent";
import { FaPlus } from "react-icons/fa";
import { fetchData } from "../../ApiRoutes";

const LeadTable = () => {
  const containerStyle = useMemo(
    () => ({ width: "95%", height: "11.82rem" }),
    []
  );
  const [newRowAdded, setNewRowAdded] = useState(false);
  const gridStyle = useMemo(
    () => ({ height: "100%", width: "100%", border: "solid 1px #802a8f" }),
    []
  );
  const [rowData, setRowData] = useState();
  const gridRef = useRef(null);

  // Table Headers
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "id",
      width: 90,
      editable: false,
      cellRenderer: (params) => {
        const { value } = params;
        const handleClick = () => {
          window.location.replace(`/patient/${value}`);
        };

        const cellStyle = {
          color: "#000", // Set the text color
          textDecoration: "underline", // Add underline to the text
          cursor: "pointer", // Change cursor to pointer on hover
        };
        return (
          <p onClick={handleClick} style={cellStyle}>
            {value}
          </p>
        );
      },
    },
    { field: "phoneNumber", filter: "agTextColumnFilter" },
    { field: "callerName", filter: true },
    {
      field: "patientName",
      filter: true,
    },
    {
      headerName: "Date Of Contact",
      field: "dateOfContact",
      filter: "agDateColumnFilter",
      editable: true,
    },
    {
      headerName: "Lead Channel",
      field: "leadChannel",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Web Form",
          "Whatsapp",
          "Call",
          "Just Dial",
          "Walk In",
          "Referral",
          "GMB",
          "Social Media",
          "YouTube",
        ],
      },
    },
    {
      headerName: "Campaign",
      field: "campaign",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Organic",
          "Op",
          "PET CT",
          "Biopsy",
          "Surgery",
          "Influencer",
          "Pediatric",
        ],
      },
    },
    {
      field: "coachNotes",

      width: 500,
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
      headerName: "Relevant",
      field: "relevant",
      width: 110,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0, 1],
      },
    },
    {
      headerName: "Interested",
      field: "interested",
      width: 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0, 1],
      },
    },
    {
      headerName: "Conv",
      field: "conv",
      width: 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0, 1],
      },
    },
    {
      headerName: "Pre Op",
      field: "preOp",
      width: 110,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [0, 1],
      },
    },
    {
      headerName: "Level",
      field: "level",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Very Hot", "Hot", "Cold", "Closed"],
      },
    },

    {
      headerName: "Stage",
      field: "stage",
      width: 120,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Lead", "Op", "Diag", "Ip"],
      },
    },
  ]);
  // column default settings
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  // This function will be called when the leads data comes after suucesss fetch....
  const onGridReady = useCallback(async (params) => {
    try {
      // This fetchData will be kept in the Apiroutes Component
      const updateCellValues = await fetchData("get-leads", getRequestHeaders);
      setRowData(updateCellValues);
    } catch (err) {
      toast.error("Failed To Get The Leads");
    }
  }, []);

  const insertDataIntoFollowupTable = async (appendNewRow, stageType) => {
    try {
      const options = {
        method: "POST",
        ...getPostRequestHeaders,
        body: JSON.stringify({
          id: appendNewRow?.id,
          stage: appendNewRow?.stage,
        }),
      };
      // In the first step when the user clicks on add new button first the followup will be added
      const addFollowup = await fetchData("add-followup", options);
      // If the followup's updated successfully than the  new value will be updated in the frontend and backend
      if (stageType === "firstTime") {
        // This will be called after the followupdata added for the first time
        updateToDatabase(appendNewRow);
      } else {
        // Other wise it will update particular changed value
        updateCellValues({
          id: appendNewRow.id,
          field: appendNewRow.field,
          newValue: appendNewRow.stage,
        });
      }
    } catch (error) {
      toast.error("This lead Stage Already Exists");
      onGridReady();
    }
  };

  const updateCellValues = async (bodyData) => {
    const options = {
      method: "PUT",
      ...getPostRequestHeaders,
      body: JSON.stringify({
        id: bodyData.id,
        field: bodyData.field,
        value: bodyData.newValue,
      }),
    };

    // It will update the Particular lead value by taking field name as key and new value as modifed value
    try {
      const updateLead = await fetchData("update-lead", options);
      toast.success("Updated Successfully");
    } catch (err) {
      alert("Something Went Wrong");
    }
  };

  const updateToDatabase = async (appendNewRow) => {
    try {
      const options = {
        method: "POST",
        ...getPostRequestHeaders,
        body: JSON.stringify(appendNewRow),
      };

      // This function wil add the lead Into lead table
      const addLead = await fetchData("add-lead", options);
      onGridReady();
      setNewRowAdded(true);
      setRowData((prevData) => [...prevData, appendNewRow]);
    } catch (error) {
      alert("");
    }
  };

  const handleCellEdit = useCallback((event) => {
    const { data, oldValue, newValue } = event;
    // If the col-field name is stage then the below condition code will be executed
    if (event.colDef.field === "stage") {
      // To check whether the previous stage value less than current value
      // The order is Lead > Op > Diag >Ip
      if (oldValue === "Op" && newValue === "Lead") {
        alert("This stage already done");
        // OnGridReady will update the ui
        onGridReady();
      } else if (
        oldValue === "Diag" &&
        (newValue === "Op" || newValue === "Lead")
      ) {
        alert("This stage already done");
        onGridReady();
      } else if (
        oldValue === "Ip" &&
        (newValue === "Lead" || newValue === "Op" || newValue === "Diag")
      ) {
        alert("This stage already done");
        onGridReady();
      } else {
        const appendNewRow = {
          id: data.id,
          stage: event.newValue,
          field: event.colDef.field,
        };
        insertDataIntoFollowupTable(appendNewRow);
      }
    } // If the col-field is date than this condition will get executed
    else if (event.colDef.field === "dateOfContact") {
      const getTheDate = new Date(newValue);
      // It checks whether the given date is sunday or not
      if (getTheDate.getDay() === 0) {
        alert("You Can't Set The Date on Sunday");
        onGridReady();
      } // If the given date is not sunday than this block of code will get's excuted
      else {
        // This condition checks whether the date changed lead id stage = Lead or not
        if (data.stage === "Lead") {
          const updateTheDate = async () => {
            const options = {
              method: "PUT",
              ...getPostRequestHeaders,
              body: JSON.stringify({
                id: data.id,
                field: "date",
                value: event.newValue,
                followupId: 1,
                leadStage: "Lead",
              }),
            };

            try {
              // IT will add the new changed stage followups into followup_Table
              const updateFollowupLead = await fetchData(
                "update-followup-lead",
                options
              );

              // If the followup's updated successfully than the lead stage new value will be updated in the frontend and backend
              updateCellValues({
                id: data.id,
                field: event.colDef.field,
                newValue: event.newValue,
              });
            } catch (err) {
              console.log(err);
            }
          };

          updateTheDate();
        } else {
          alert("You can't set the date except Lead stage");
          onGridReady();
        }
      }
    } else {
      updateCellValues({
        id: data.id,
        field: event.colDef.field,
        newValue: event.newValue,
      });
    }
  }, []);

  // When you Click on add new row then this function will be called.....
  const handleAddRow = useCallback(() => {
    // To get the last Index
    const lastRow = rowData[rowData.length - 1];
    let currentDate = new Date();

    // It checks the current day sunday or not
    if (currentDate.getDay() === 0) {
      alert("Today is Sunday");
    } else {
      // If not sunday than adds one day
      currentDate.setDate(currentDate.getDate() + 1);
      // And checks the added day is alos not sunday or not
      if (currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
        date < 10 ? "0" + date : date
      }`;
      // to append the new row in frontend
      const appendNewRow = {
        id: rowData.length + 1,
        age: 20,
        campaign: "Op",
        coachNotes: "Enter Your Note",
        conv: 0,
        email: "abc@gmail.com",
        phoneNumber: 123456789,
        callerName: "default",
        patientName: "default",
        leadChannel: "Web Form",
        coachName: "Ruthvik",
        gender: "Male",
        typeOfCancer: "default",
        location: "default",
        relationsToPatient: "default",
        inboundOutbound: "Inbound",
        relevant: 0,
        interested: 0,
        preOp: 0,
        dateOfContact: formattedDate,
        level: "Cold",
        stage: "Lead",
      };
      insertDataIntoFollowupTable(appendNewRow, "firstTime");
    }
  }, [rowData]);

  // Classname to highlight the row
  const rowClassRules = {
    "highlight-row": (params) => params.node.rowIndex === 0 && newRowAdded,
  };

  // To give the paginationdefault values
  const paginationPageSizeSelector = [50, 100, 200, 500];

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value
    );
  }, []);

  // To add the each cell navigation with keyboard arrow
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

  // To set The auto headers Width
  const autoSizeStrategy = {
    type: "fitCellContents",
  };

  const filteredData = () => {
    const filteredRows = gridRef.current.api.getModel().rowsToDisplay;
    const setFilteredRowData = filteredRows.map((each) => each.data);
    return setFilteredRowData;
  };

  return (
    <div
      className="d-flex flex-column  justify-content-center  align-items-center "
      style={{
        padding: "0.5rem",
      }}
    >
      <div style={containerStyle}>
        <div className="example-wrapper">
          {/* Search Filter Container */}
          <div className="example-header">
            <input
              type="text"
              id="filter-text-box"
              placeholder="Filter..."
              onChange={onFilterTextBoxChanged}
            />
            <FaSearch className="input-icon" />
          </div>
          {/* Add Button and Download Data Into Excel Container */}
          <div className="download-add-btn-container">
            {/* Add new Button */}
            <button className="add-button" onClick={handleAddRow}>
              <FaPlus />
            </button>
            {/* Download Button */}
            <ExcelComponent data={filteredData} filename="my_data.xlsx" />
          </div>
        </div>

        {/* Ag Grid Container */}
        <div style={gridStyle} className={"ag-theme-quartz-dark"}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            autoSizeStrategy={autoSizeStrategy}
            onCellValueChanged={handleCellEdit}
            ref={gridRef}
            rowClassRules={rowClassRules}
            suppressMenuHide={true}
            stopEditingWhenCellsLoseFocus={true}
            navigateToNextCell={navigateToNextCell}
            scrollbarWidth={3}
            debounceVerticalScrollbar={true}
            pagination={true}
            paginationPageSize={50}
            paginationPageSizeSelector={paginationPageSizeSelector}
          />
        </div>

        {/* Toast Message Container */}
        <ToastContainer
          position="top-right"
          autoClose={1000}
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

export default LeadTable;
