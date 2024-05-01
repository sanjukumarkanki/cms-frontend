import React, { Fragment, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';

const SelectedComponent = (params) => {
  const { id, keyName, dropdownOptions } = params;
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3003/get-specific-key/${id}/${keyName}`);
        if (response.ok) {
          const updateUserDetails = await response.json();
          setSelectedValue(updateUserDetails[keyName]);
        } else {
          setErrorMessage(true);
        }
      } catch (err) {
        setErrorMessage(true);
        console.log(err.message);
      }
    };

    fetchDetails();
  }, [id, keyName]);


  function addSpaceBeforeCapitalLetters(str) {
    if (typeof str !== 'string') {
      return str; 
    }
    return str.replace(/([A-Z])/g, ' $1').trim();
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        field: keyName,
        value: newValue // Use the new value here
      })
    };

    try {

      const fetchRequest = async () => {
        const fetchRequest = await fetch("http://localhost:3003/update-lead", options);
        if (!fetchRequest.ok) {
          throw new Error('Failed to update lead');
        } else {
          toast.success('Updated Successfully', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }


      if(keyName === "stage"){

         if(selectedValue === "Op" && newValue === "Lead" ){
          alert("This stage already done")
          console.log("Sanju1")
        }else if((selectedValue === "Diag") && (newValue === "Op" || newValue === "Lead")){
          alert("This stage already done")
          console.log("Sanju2")
        }else if((selectedValue === "Ip") && (newValue === "Lead" || newValue === "Op" || newValue === "Diag")){
          alert("This stage already done")
          console.log("Sanju3")
        }else{
          setSelectedValue(newValue)
          fetchRequest()
          console.log("Sucess")
        }
      }   else{
        fetchRequest()
      }


    } catch (err) {
      toast.error("Update Unsuccessful.");
      console.log(err)
    }
  };


  return (
    <Fragment>
      {selectedValue !== "" ?         <Fragment>
      <label>{formatString(keyName)}</label>
      <select value={selectedValue} onChange={updateLead}>
        {dropdownOptions.map((each, index) => 
          <option key={index}>{each}</option> // Ensure each option has a unique key
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
    </Fragment> : null
      }
    </Fragment>
  );
};

export default SelectedComponent;
