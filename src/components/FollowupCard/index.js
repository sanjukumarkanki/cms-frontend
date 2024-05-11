import React, { useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { LuBellRing } from "react-icons/lu";
import { toast } from "react-toastify";
import { Editor } from "primereact/editor";

import { baseUrl } from "../../App";

const FollowupCard = (props) => {
  const { each, index, getFollowups } = props;
  const [text, setText] = useState("");
  const [inputTimer, setInputTimer] = useState(each.time);
  const [timerError, setTimerError] = useState("");
  const [updateColor, setBgColor] = useState("");
  const [leadValue, setLeadValue] = useState(each.level);

  const onLeadSelect = async (e, bodyData) => {
    setLeadValue(e.target.value);
    console.log(e.target.value);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bodyData.id,
        field: bodyData.field,
        value: e.target.value,
        followupId: bodyData.followupId,
      }),
    };
    try {
      const fetchRequest = await fetch(`${baseUrl}/update-lead`, options);
      if (!fetchRequest.ok) {
        throw new Error("Failed to update lead");
      } else {
        getFollowups();
      }
    } catch (err) {
      toast.error("Update Unsuccessful.");
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: bodyData.id,
            field: bodyData.field,
            value: `${inputTimer}:00`,
            followupId: bodyData.followupId,
            leadStage: bodyData.leadStage,
          }),
        };
        try {
          const fetchRequest = await fetch(
            `${baseUrl}/update-followup-lead`,
            options
          );
          if (!fetchRequest.ok) {
            throw new Error("Failed to update lead");
          } else {
            setTimerError("");
            alert("Sucess");
            dialog.close();
            getFollowups();
          }
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bodyData.id,
          field: bodyData.field,
          value: text,
          followupId: bodyData.followupId,
          leadStage: bodyData.leadStage,
        }),
      };
      try {
        const updateFollowupLead = await fetch(
          `${baseUrl}/update-followup-lead`,
          options
        );
        if (!updateFollowupLead.ok) {
          throw new Error("Failed to update lead");
        } else {
          const optionData = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: bodyData.id,
              field: "status",
              value: "Done",
              followupId: bodyData.followupId,
              leadStage: bodyData.leadStage,
            }),
          };
          const fetchRequest = await fetch(
            `${baseUrl}/update-followup-lead`,
            optionData
          );

          if (fetchRequest.ok) {
            console.log("dfdfd");
            getFollowups();
            dialog2.close();
          }
        }
      } catch (err) {
        toast.error("Update Unsuccessful.");
      }
    }
  };

  let cardBgColor = "#FAF6F7";
  if (each.level === "Very Hot") {
    cardBgColor = "#DD2526";
  } else if (each.level === "Hot") {
    cardBgColor = "#FF8A00";
  }

  console.log(each);

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
      className="followup-card"
      key={index}
      style={{ backgroundColor: cardBgColor }}
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
            value={leadValue}
          >
            <option>Very Hot</option>
            <option>Hot</option>
            <option>Cold</option>
            <option>Closed</option>
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
