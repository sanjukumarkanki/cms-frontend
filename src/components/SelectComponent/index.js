import React, { Fragment, useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import ReactContext from "../../contexts";
import { baseUrl } from "../../App";

const SelectedComponent = (props) => {
  const { id, keyName, dropdownOptions } = props;
  // const [errorMessage, setErrorMessage] = useState(false);

  const [selectedValue, setSelectedValue] = useState();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/get-specific-key/${id}/${keyName}`
        );
        if (response.ok) {
          const updateUserDetails = await response.json();
          setSelectedValue(updateUserDetails[keyName]);
        } else {
          toast.error("Something Went Wrong Refresh The PAge");
        }
      } catch (err) {
        toast.error("Something Went Wrong Refresh The PAge");
      }
    };

    fetchDetails();
  }, [id, keyName]);

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

  function formatString(str) {
    const stringWithSpaces = addSpaceBeforeCapitalLetters(str);
    return capitalizeFirstLetter(stringWithSpaces);
  }

  const updateLead = async (e) => {
    const newValue = e.target.value;

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: parseInt(id),
        field: keyName,
        value: newValue, // Use the new value here
      }),
    };

    const fetchRequest = async () => {
      const fetchRequest = await fetch(`${baseUrl}/update-lead`, options);
      try {
        if (!fetchRequest.ok) {
          throw new Error("Failed to update lead");
        } else {
          setSelectedValue(newValue);
          // toast.success("Updated Successfully");
        }
      } catch (err) {
        // toast.warning(err.message);
        alert("Something Wenr Wrong Please Refresh The Page");
      }
    };

    const addFollowups = async () => {
      try {
        const data = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            stage: e.target.value,
          }),
        };
        const response = await fetch(`${baseUrl}/add-followup`, data);
        if (!response.ok) {
          throw new Error("Failed to add followup");
        }
        // toast.success("Updated Successfully");
      } catch (err) {
        // toast.warning(err.message);
      }
    };

    try {
      if (keyName === "stage") {
        if (selectedValue === "Op" && newValue === "Lead") {
          alert("This stage already done");
        } else if (
          selectedValue === "Diag" &&
          (newValue === "Op" || newValue === "Lead")
        ) {
          alert("This stage already done");
        } else if (
          selectedValue === "Ip" &&
          (newValue === "Lead" || newValue === "Op" || newValue === "Diag")
        ) {
          alert("This stage already done");
        } else {
          setSelectedValue(newValue);
          addFollowups();
          fetchRequest();
          window.location.reload();
        }
      } else {
        fetchRequest();
      }
    } catch (err) {
      // toast.error(err.message);
    }
  };

  return (
    <Fragment>
      {selectedValue !== "" ? (
        <Fragment>
          <label>{formatString(keyName)}</label>
          <select value={selectedValue} onChange={updateLead}>
            {dropdownOptions.map(
              (each, index) => (
                <option key={index}>{each}</option>
              ) // Ensure each option has a unique key
            )}
          </select>
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
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default SelectedComponent;
