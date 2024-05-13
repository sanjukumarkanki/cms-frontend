import React, { Fragment, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { getPostRequestHeaders, getRequestHeaders } from "../../App";
import { fetchData } from "../../ApiRoutes";

const InputComponent = (params) => {
  const { id, keyName, type } = params;
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchDetails = async () => {
      try {
        const getSpecificValue = await fetchData(
          `get-specific-key/${id}/${keyName}`,
          getRequestHeaders,
          { signal }
        );
        setInputValue(getSpecificValue[keyName]);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchDetails();

    return () => {
      abortController.abort();
    };
  }, [id, keyName]);

  const inputChange = (e) => {
    setInputValue(e.target.value);
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateLead();
    }
  };

  const updateLead = async () => {
    const options = {
      method: "PUT",
      ...getPostRequestHeaders,
      body: JSON.stringify({
        id: id,
        field: keyName,
        value: inputValue,
      }),
    };

    try {
      const updateLead = await fetchData("update-lead", options);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getInputValue = () => {
    switch (type) {
      case "date":
        return <input type="date" disabled value={inputValue} />;
      case "textarea":
        return (
          <textarea
            style={{
              width: "21.92rem",
              height: "9.16rem",
              border: "solid #000 0.01rem",
              borderRadius: "0.11rem",
              backgroundColor: "#F9F9F9",
              padding: "0.5rem",
              textAlign: "left",
              verticalAlign: "top",
            }}
            value={inputValue}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
          />
        );
      default:
        return (
          <input
            type="text"
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
