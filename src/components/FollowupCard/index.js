import React, { useState, useRef } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { LuBellRing } from "react-icons/lu";
import { toast } from "react-toastify";
import { Editor } from "primereact/editor";
import { Menu } from "primereact/menu";
import Popup from "reactjs-popup";
import { Dialog } from "primereact/dialog";
import { baseUrl } from "../../App";

const FollowupCard = (props) => {
  const { each, index } = props;
  const [LeadValue, setLeadValue] = useState(each.level);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [inputTimer, setInputTimer] = useState(each.time);
  const [popupTimer, setPopupTimer] = useState(false);
  const [timerError, setTimerError] = useState("");
  const [updateColor, setBgColor] = useState("");

  const onLeadSelect = async (e, bodyData) => {
    setLeadValue(e.target.value);
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
        toast.success("Updated Successfully");
        window.location.reload();
      }
    } catch (err) {
      toast.error("Update Unsuccessful.");
    }
  };

  const updateTextArea = async (e, bodyData) => {
    if (bodyData.field === "time") {
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
            value: inputTimer,
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
            alert("Updated Successfully");
            window.location.reload();
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
        const fetchRequest = await fetch(
          `${baseUrl}/update-followup-lead`,
          options
        );
        if (!fetchRequest.ok) {
          throw new Error("Failed to update lead");
        } else {
          alert("Coach Note Updated Successfully");
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
            "http://localhost:3003/update-followup-lead",
            optionData
          );

          if (fetchRequest.ok) {
            window.location.reload();
          }
        }
      } catch (err) {
        toast.error("Update Unsuccessful.");
      }
    }
  };

  console.log(each);

  let cardBgColor = "#FAF6F7";
  if (each.level === "Very Hot") {
    cardBgColor = "#DD2526";
  } else if (each.level === "Hot") {
    cardBgColor = "#FF8A00";
  }

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
            value={LeadValue}
            onChange={(e) =>
              onLeadSelect(e, {
                id: each.id,
                field: "level",
                followupId: each.followupId,
              })
            }
          >
            <option>Very Hot</option>
            <option>Hot</option>
            <option>Cold</option>
            <option>closed</option>
          </select>
        </div>
      </div>

      <div className="followup-card__name-container">
        <p>Phone Number:</p>
        <p>{each.phoneNumber}</p>
      </div>

      <div className="followup-card__snooze-done-container">
        <button
          onClick={() => setVisible(true)}
          style={{ color: `${each.level === "Cold" ? "#80288F" : "#fff"}` }}
        >
          <TiTick className="tick-icon" /> Done
        </button>
        <Dialog
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          <Editor
            style={{ width: "100%" }}
            value={text}
            onTextChange={(e) => {
              if (e.htmlValue !== null) {
                const textContent = e.htmlValue.replace(/<[^>]+>/g, ""); // Remove HTML tags
                setText(textContent);
              }
            }}
          />
          <button
            onClick={(e) =>
              updateTextArea(e, {
                id: each.id,
                field: "coachNotes",
                followupId: each.followupId,
                leadStage: each.stage,
              })
            }
            className="done-btn"
          >
            Done
          </button>
        </Dialog>
        <button
          className="snooze-button"
          style={{ color: `${each.level === "Cold" ? "#80288F" : "#fff"}` }}
          onClick={() => setPopupTimer(true)}
        >
          <LuBellRing className="tick-icon" />
          Snooze
        </button>

        <Dialog
          visible={popupTimer}
          style={{ width: "15rem" }}
          onHide={() => setPopupTimer(false)}
        >
          <div className="timer-popup">
            <h3>Set The Time </h3>
            <input
              type="time"
              style={{ textAlign: "center" }}
              value={inputTimer}
              onChange={(e) => setInputTimer(e.target.value)}
              className="timer-container"
            />
            {timerError !== "" && <p>{timerError}</p>}
            <button
              onClick={(e) =>
                updateTextArea(e, {
                  id: each.id,
                  field: "time",
                  followupId: each.followupId,
                  leadStage: each.stage,
                })
              }
              className="done-btn"
            >
              Done
            </button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default FollowupCard;
