import React, { Fragment, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const InputComponent = (params) => {
  const { id, keyName, type } = params;
  const [errorMessage, setErrorMessage] = useState(false);
  const [inputValue, setInputValue] = useState("");


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3003/get-specific-key/${id}/${keyName}`);
        if (response.ok) {
          const updateUserDetails = await response.json();
          setInputValue(updateUserDetails[keyName]);
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

  const inputChange = (e) => {
    setInputValue(e.target.value);
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateLead();
    }
  };

  const updateLead = async () => {
    const options = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        field: keyName,
        value: inputValue
      })
    };

    try {
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
    } catch (err) {
      toast.warning("Update Unsuccessful.");
    }
  };

  const getInputValue = () => {
    switch (type) {
      case 'date':
        return <input type='date' disabled value={inputValue}  />;
      case 'textarea':
        return (
          <textarea
            style={{
              width: '21.92rem',
              height: '9.16rem',
              border: 'solid #000 0.01rem',
              borderRadius: '0.11rem',
              backgroundColor: '#F9F9F9',
              padding: '0.5rem',
              textAlign: 'left',
              verticalAlign: 'top',
            }}
            value={inputValue}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
          />
        );
      default:
        return (
          <input
            type='text'
            value={inputValue}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
          />
        );
    }
  };

  return (
    <Fragment>
      <label>{formatString(keyName)}</label>
      {getInputValue()}
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
  );
};

export default InputComponent;
