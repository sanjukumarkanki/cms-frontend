import React, { useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { LuBellRing } from "react-icons/lu";
import { toast } from "react-toastify";
import { Editor } from "primereact/editor";

import { getPostRequestHeaders } from "../../App";
import { fetchData } from "../../ApiRoutes";

const FollowupCard = (props) => {
  const { each, index, getFollowups, setDashboardFollowups } = props;
  const [timer, setTimer] = useState(each.time);
  console.log(each);

  // CoachNote text state
  const [text, setText] = useState("");
  // If the timer condition not matched the warning text will updated throught this state
  const [timerError, setTimerError] = useState("");

  // When the followup Level is changed than this function gets triggered
  const onLeadSelect = async (e, bodyData) => {
    const getLevelValue = e.target.value;
    // To send the headers and body to api
    const options = {
      method: "PUT",
      ...getPostRequestHeaders,
      body: JSON.stringify({
        id: bodyData.id,
        field: bodyData.field,
        value: e.target.value,
        followupId: bodyData.followupId,
      }),
    };
    try {
      // To update lead changed value in the backend
      const updateLead = await fetchData("update-lead", options);
      // getFollowups funtion will be kept in parent componet that will update data in the frontend
      getFollowups();
      // window.location.reload();
    } catch (err) {
      console.log("Update Unsuccessful.");
    }
  };

  const updateTextArea = async (e, bodyData) => {
    // If updated filed name === time this function will be called
    if (bodyData.field === "time") {
      // To get the dailogbox id
      var dialog = document.getElementById("myDialog");
      // To remove the : in timer
      const getTime = parseInt(each.time.split(":")[0]);
      // To get the Date
      const getCurrentTime = new Date();
      // To get the time from the current Date
      const hours = getCurrentTime.getHours();

      // To check, If the hours is less than 6'0 clock pm and greater than 9 AM
      if (getTime >= hours && getTime < 18) {
        console.log(bodyData, "dfdfdfdf");
        // Fetch Request updated data
        const options = {
          method: "PUT",
          ...getPostRequestHeaders,
          body: JSON.stringify({
            id: bodyData.id,
            field: bodyData.field,
            value: `${timer}:00`,
            followupId: bodyData.followupId,
            leadStage: bodyData.leadStage,
          }),
        };
        try {
          // Fetch Request to update the time
          const updateFollowupLead = await fetchData(
            "update-followup-lead",
            options
          );
          // To set time error
          setTimerError("");
          // To close the diaglobox after successfully updating the timer
          dialog.close();
          // getFollowups();
          window.location.reload();
        } catch (err) {
          toast.error("Update Unsuccessful.");
        }
      } else {
        setTimerError(
          "You can't set a time before the current time and after 6 pm"
        );
      }
    } else {
      // Second Dialgo Box
      var dialog2 = document.getElementById("mydialog2");
      // BodyData
      const options = {
        method: "PUT",
        ...getPostRequestHeaders,
        body: JSON.stringify({
          id: bodyData.id,
          field: bodyData.field,
          value: text,
          followupId: bodyData.followupId,
          leadStage: bodyData.leadStage,
        }),
      };
      try {
        // To update the all the followups status to Done
        const updateFollowupLead = await fetchData(
          "update-followup-lead",
          options
        );

        const optionData = {
          method: "PUT",
          ...getPostRequestHeaders,
          body: JSON.stringify({
            id: bodyData.id,
            field: "status",
            value: "Done",
            followupId: bodyData.followupId,
            leadStage: bodyData.leadStage,
          }),
        };
        // to update followup value
        const fetchRequest = await fetchData(
          `update-followup-lead`,
          optionData
        );
        getFollowups();
        dialog2.close();
      } catch (err) {
        toast.error("Update Unsuccessful.");
      }
    }
  };

  const showModalPopup = (id) => {
    // To get the popup id dynamically
    const modelBox = document.getElementById(id);
    if (modelBox) {
      // It will opens the showmodal
      modelBox.showModal();
      // To close even the user clicks on outside of the popup
      window.onclick = function (event) {
        if (event.target === modelBox) {
          modelBox.close();
        }
      };
    }
  };

  // Note Editor options
  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <div
      className="followup-card  "
      key={index}
      style={{
        backgroundColor:
          each.level === "Very Hot"
            ? "#DD2526"
            : each.level === "Hot"
            ? "#FF8A00"
            : "#FAF6F7",
      }}
    >
      {/* Patient Name Container */}
      <Link
        to={`/patient/${each.id}`}
        className="followup-card__name-container"
      >
        <p>Name :</p>
        <p>{each.patientName}</p>
      </Link>
      {/* Patient Stage and Level Container */}
      <div className="followup-card__stage-lead-container">
        {/* Stage Container */}
        <div className="followup-card__stage-container">
          <p>Stage:</p>
          <p>{each.stage}</p>
        </div>
        {/*  Level Container */}
        <div className="followup-card__lead-container">
          <label>Level:</label>
          {/* Patient Dropdown */}
          <select
            onChange={(e) =>
              onLeadSelect(e, {
                id: each.id,
                field: "level",
                followupId: each.followupId,
              })
            }
            value={each.level}
          >
            {["Very Hot", "Hot", "Cold", "Closed"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Phone Number Container */}
      <div className="followup-card__name-container">
        <p>Phone Number:</p>
        <p>{each.phoneNumber}</p>
      </div>

      <div className="followup-card__snooze-done-container">
        {/* Followup Done Button */}
        <button
          onClick={() => showModalPopup("mydialog2")}
          style={{ color: each.level === "Cold" ? "#80288F" : "#fff" }}
        >
          <TiTick className="tick-icon" /> Done
        </button>
        {/* Coach Note Popup */}
        <dialog id="mydialog2" style={{ width: "80%" }}>
          {/*Note Editor*/}
          <Editor
            value={text}
            headerTemplate={header}
            onTextChange={(e) => {
              if (e.htmlValue !== null) {
                const textContent = e.htmlValue.replace(/<[^>]+>/g, "");
              }
            }}
            style={{ height: "50vh" }}
          />
          {/*Note Editor* Done Button */}

          <button
            type="button"
            onClick={(e) =>
              updateTextArea(e, {
                id: each.id,
                field: "coachNotes",
                followupId: each.followupId,
                leadStage: each.stage,
              })
            }
            className="done-btn "
          >
            Done
          </button>
        </dialog>

        {/* Snooze Button */}
        <button
          className="snooze-button"
          style={{ color: each.level === "Cold" ? "#80288F" : "#fff" }}
          onClick={() => showModalPopup("myDialog")}
        >
          <LuBellRing className="tick-icon" />
          Snooze
        </button>

        {/*Snooze Timer Popup */}
        <dialog id="myDialog" style={{ width: "15rem" }}>
          <div className="timer-popup">
            <h3>Set The Time </h3>
            {/* Input Timer */}
            <input
              type="time"
              style={{ textAlign: "center" }}
              value={timer}
              onChange={(e) => {
                // console.log(each, "dfddsanju");
                // setDashboardFollowups((prevData) =>
                //   prevData.map((item) => {
                //     return item.id === parseInt(each.id)
                //       ? { ...item, time: e.target.value }
                //       : item;
                //   })
                // );
                // console.log(each, "dfddsanju");
                setTimer(e.target.value);
              }}
              className="timer-container"
            />
            {timerError && <p>{timerError}</p>}
            {/* Input Popup Done button */}
            <button
              onClick={(e) =>
                updateTextArea(e, {
                  id: each.id,
                  field: "time",
                  followupId: each.followupId,
                  leadStage: each.stage,
                })
              }
              className="timer-popup__done-btn"
            >
              Done
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
};

const MemoizedFollowupCard = React.memo(FollowupCard);
export default MemoizedFollowupCard;
