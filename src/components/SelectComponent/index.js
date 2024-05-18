import React, { Fragment, useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactContext from "../../contexts";
import { getPostRequestHeaders, getRequestHeaders } from "../../App";
import { fetchData } from "../../ApiRoutes";

const SelectedComponent = (props) => {
  const { setFollowupData } = useContext(ReactContext);
  const { id, keyName, dropdownOptions, value, setUserData } = props;

  function addSpaceBeforeCapitalLetters(str) {
    if (typeof str !== "string") {
      return str;
    }
    return str.replace(/([A-Z])/g, " $1").trim();
  }

  function capitalizeFirstLetter(str) {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // To Convert The returnted text into capitalize format
  function formatString(str) {
    const stringWithSpaces = addSpaceBeforeCapitalLetters(str);
    return capitalizeFirstLetter(stringWithSpaces);
  }

  const updateLead = async (e) => {
    const newValue = e.target.value;
    const options = {
      method: "PUT",
      ...getPostRequestHeaders,
      body: JSON.stringify({
        id: parseInt(id),
        field: keyName,
        value: newValue, // Use the new value here
      }),
    };

    /* After adding the followups this function will be called to update the followuptable data
    which is stored in the global state with followupData and the setFollowupData function 
    will assign the updated data
    */
    const fetchRequest = async () => {
      try {
        const updateLead = await fetchData("update-lead", options);
        if (
          keyName === "stage" ||
          (keyName === "level" && newValue === "Closed")
        ) {
          const getPatientFollowups = await fetchData(
            `patient-followups/${id}`,
            getRequestHeaders
          );
          setFollowupData(getPatientFollowups);
        }
        // toast.success("Updated Successfully");
        alert("Sucess");
      } catch (err) {
        // toast.warning("Update Unsucessful.");
        alert("Failed");
      }
    };

    // This funciton will be called when the user/coach changes the stage to op || Diag ...etc
    const addFollowups = async (e) => {
      try {
        const data = {
          method: "POST",
          ...getPostRequestHeaders,
          body: JSON.stringify({
            id: parseInt(id),
            stage: e,
          }),
        };

        // To add new stage followups in the followup table
        const response = await fetchData(`add-followup`, data);

        // toast.success("Updated Successfully");
      } catch (err) {
        console.log(err.message);
      }
    };

    try {
      // To show the alert box that the curretnt stage is already exists or not
      if (keyName === "stage") {
        // If the value is Op and newValue not be Lead
        if (value === "Op" && newValue === "Lead") {
          alert("This stage already done");
        } // If the value is Diag and newValue not be Op, Lead
        else if (
          value === "Diag" &&
          (newValue === "Op" || newValue === "Lead")
        ) {
          alert("This stage already done");
        } // If the value is Ip and newValue not be Lead, Op, Diag
        else if (
          value === "Ip" &&
          (newValue === "Lead" || newValue === "Op" || newValue === "Diag")
        ) {
          alert("This stage already done");
        } else {
          // If all above conditions is matched than it will update the selected value in the frontend
          setUserData((prevData) =>
            prevData.map((item) => {
              return item.id === parseInt(id)
                ? { ...item, [keyName]: newValue }
                : item;
            })
          );

          // It will add the new stage followups in the followup table
          addFollowups(newValue);
          // if followups added successfully than that particular followups will be shown in frontend without refresh
          fetchRequest();
        }
      } else {
        // If the selected value keyname  !== "stage" than first it will update the userDetails
        setUserData((prevData) =>
          prevData.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, [keyName]: newValue }
              : item;
          })
        );
        // After that it will update and show the updated data in the frntend
        fetchRequest();
      }
    } catch (err) {
      // toast.error(err.message);
      console.log(err);
      // toast.error("Update Unsuccessful.");
    }
  };

  return (
    <Fragment>
      {value !== "" ? (
        <Fragment>
          <label>{keyName}</label>
          <select value={value} id={value} onChange={updateLead}>
            {dropdownOptions.map(
              (each, index) => (
                <option key={index}>{each}</option>
              ) // Ensure each option has a unique key
            )}
          </select>
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
        </Fragment>
      ) : null}
    </Fragment>
  );
};

const MemoizedSelectComponent = React.memo(SelectedComponent);

export default MemoizedSelectComponent;
