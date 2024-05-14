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
  const { each, index, getFollowups } = props;

  const [text, setText] = useState("");
  const [inputTimer, setInputTimer] = useState(each.time);
  const [timerError, setTimerError] = useState("");
  // const [leadValue, setLeadValue] = useState(each.level);

  const onLeadSelect = async (e, bodyData) => {
    const getLevelValue = e.target.value;
    // setLeadValue(getLevelValue);
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
      const updateLead = await fetchData("update-lead", options);
      getFollowups();
      // window.location.reload();
    } catch (err) {
      console.log("Update Unsuccessful.");
    }
  };

  const updateTextArea = async (e, bodyData) => {
    if (bodyData.field === "time") {
      var dialog = document.getElementById("myDialog");
      const getTime = parseInt(inputTimer.split(":")[0]);
      const getCurrentTime = new Date();
      const hours = getCurrentTime.getHours();
      if (getTime >= hours && getTime < 18) {
        const options = {
          method: "PUT",
          ...getPostRequestHeaders,
          body: JSON.stringify({
            id: bodyData.id,
            field: bodyData.field,
            value: `${inputTimer}:00`,
            followupId: bodyData.followupId,
            leadStage: bodyData.leadStage,
          }),
        };
        try {
          const updateFollowupLead = await fetchData(
            "update-followup-lead",
            options
          );
          setTimerError("");
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
      var dialog2 = document.getElementById("mydialog2");
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
        const fetchRequest = await fetchData(
          `update-followup-lead`,
          optionData
        );
        // getFollowups();
        dialog2.close();
        window.location.reload();
      } catch (err) {
        toast.error("Update Unsuccessful.");
      }
    }
  };

  const showModalPopup = (id) => {
    const modelBox = document.getElementById(id);
    if (modelBox) {
      modelBox.showModal();
      window.onclick = function (event) {
        if (event.target === modelBox) {
          modelBox.close();
        }
      };
    }
  };

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
      <Link
        to={`/patient/${each.id}`}
        className="followup-card__name-container"
      >
        <p>Name :</p>
        <p>{each.patientName}</p>
      </Link>

      <div className="followup-card__stage-lead-container">
        <div className="followup-card__stage-container">
          <p>Stage:</p>
          <p>{each.stage}</p>
        </div>

        <div className="followup-card__lead-container">
          <label>Level:</label>
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

      <div className="followup-card__name-container">
        <p>Phone Number:</p>
        <p>{each.phoneNumber}</p>
      </div>

      <div className="followup-card__snooze-done-container">
        <button
          onClick={() => showModalPopup("mydialog2")}
          style={{ color: each.level === "Cold" ? "#80288F" : "#fff" }}
        >
          <TiTick className="tick-icon" /> Done
        </button>
        {/* Note Popup */}

        <dialog id="mydialog2" style={{ width: "80%" }}>
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

        <button
          className="snooze-button"
          style={{ color: each.level === "Cold" ? "#80288F" : "#fff" }}
          onClick={() => showModalPopup("myDialog")}
        >
          <LuBellRing className="tick-icon" />
          Snooze
        </button>

        {/*Snooze Timer Container */}
        <dialog id="myDialog" style={{ width: "15rem" }}>
          <div className="timer-popup">
            <h3>Set The Time </h3>
            <input
              type="time"
              style={{ textAlign: "center" }}
              value={inputTimer}
              onChange={(e) => setInputTimer(e.target.value)}
              className="timer-container"
            />
            {timerError && <p>{timerError}</p>}
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

export default FollowupCard;
