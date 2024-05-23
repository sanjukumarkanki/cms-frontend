import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { getPostRequestHeaders } from "../../App";
import { fetchData } from "../../ApiRoutes";

const InputComponent = (params) => {
  const { id, keyName, type, value, setUserData } = params;

  // To update the input value
  const inputChange = (e) => {
    setUserData((prevData) =>
      prevData.map((item) => {
        return item.id === parseInt(id)
          ? { ...item, [keyName]: e.target.value }
          : item;
      })
    );
  };

  // To Add Space Before Elements
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

  // To updated Entered text in the backend using put method
  const updateLead = async () => {
    const options = {
      method: "PUT",
      ...getPostRequestHeaders,
      body: JSON.stringify({
        id: id,
        field: keyName,
        value: value,
      }),
    };

    try {
      const updateLead = await fetchData("update-lead", options);
    } catch (err) {
      console.log(err.message);
    }
  };

  // To show different kindQ of input types......
  const getInputValue = () => {
    switch (type) {
      case "date":
        return (
          <input type="date" onChange={inputChange} disabled value={value} />
        );
      case "textarea":
        return (
          <textarea
            onBlur={updateLead}
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
            value={value}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
            onBlur={updateLead}
          />
        );
    }
  };

  return (
    <Fragment>
      <label>
        {keyName === "relationsToPatient" ? "Relation" : formatString(keyName)}
      </label>
      {/* getInputValue() function will display the current value type input.
      For example if value is patienName it will display input type="text"
      and if value is dateOfBirth it will display input type="date" */}
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

const MemoizedInputComponent = React.memo(InputComponent);

export default MemoizedInputComponent;
