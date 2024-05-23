import React, { Fragment, useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { LuBellRing } from "react-icons/lu";
import { toast } from "react-toastify";
import { Editor } from "primereact/editor";

import { getPostRequestHeaders } from "../../App";
import { fetchData } from "../../ApiRoutes";
import Popup from "reactjs-popup";

const FollowupCard = (props) => {
  const {
    each,
    index,
    getFollowups,
    setDashboardFollowups,
    DashboardFollowUps,
  } = props;

  const [selectedDialog, setSelectedDialog] = useState("");
  const [updateFollowupDone, setUpdateFollowupDone] = useState(false);
  const [addDateForNextFollowup, setAddDateForNextFollowup] = useState(false);
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

  const updateTextArea = async (e, close, isSetDate, bodyData) => {
    console.log(addDateForNextFollowup, "added");

    // If updated filed name === time this function will be called
    if (bodyData.field === "time") {
      // To get the dailogbox id
      var dialog = document.getElementById("myDialog");
      // To remove the : in timer
      const getHours = parseInt(each.time.split(":")[0]);
      const getMinutes = parseInt(each.time.split(":")[1]);
      // To get the Date
      const getCurrentTime = new Date();
      // To get the time from the current Date
      const hours = getCurrentTime.getHours();
      const minutes = getCurrentTime.getMinutes();
      // To check, If the hours is less than 6'0 clock pm and greater than 9 AM
      if (getHours >= hours && getHours < 18 && getMinutes >= minutes) {
        // Fetch Request updated data
        const options = {
          method: "PUT",
          ...getPostRequestHeaders,
          body: JSON.stringify({
            id: bodyData.id,
            field: bodyData.field,
            value: each.time,
            followupId: bodyData.followupId,
            leadStage: bodyData.leadStage,
          }),
        };
        try {
          // Fetch Request to update the time ENRMT,Y 1
          const updateFollowupLead = await fetchData(
            "update-followup-lead",
            options
          );
          // To set time error
          setTimerError("");
          close();
          getFollowups();
          // To close the diaglobox after successfully updating the timer
          // dialog.close();
          // window.location.reload();
        } catch (err) {
          toast.error("Update Unsuccessful.");
        }
      } else {
        setTimerError(
          "You can't set a time before the current time and after 6 pm"
        );
      }
    } else {
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
        // To update the Coach Note Value
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
            changeDate: addDateForNextFollowup,
          }),
        };
        // to update followup status to done
        if (isSetDate === "set date") {
          const fetchRequest = await fetchData(
            `update-followup-dates`,
            optionData
          );
          close();
          getFollowups();
          updateFollowupDone(false);
        } else {
          const fetchRequest = await fetchData(
            `update-followup-lead`,
            optionData
          );
          close();
          getFollowups();
          updateFollowupDone(false);
        }
      } catch (err) {
        toast.error("Update Unsuccessful.");
      }
    }
  };

  const showModalPopup = (id, value) => {
    // To get the popup id dynamically
    const modelBox = document.getElementById(id);
    if (modelBox) {
      // It will opens the showmodal
      modelBox.showModal();

      setSelectedDialog(value);
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
        <Popup
          modal
          onClose={() => setUpdateFollowupDone(false)}
          trigger={
            <button
              onClick={() => showModalPopup("mydialog2")}
              style={{ color: each.level === "Cold" ? "#80288F" : "#fff" }}
            >
              <TiTick className="tick-icon" /> Done
            </button>
          }
        >
          {(close) => (
            <div className="coachNote-popup">
              {!updateFollowupDone ? (
                <Fragment>
                  <Editor
                    value={text}
                    headerTemplate={header}
                    onTextChange={(e) => {
                      if (e.htmlValue !== null) {
                        const textContent = e.htmlValue.replace(/<[^>]+>/g, "");
                        setText(textContent);
                      }
                    }}
                    style={{ height: "30vh" }}
                  />
                  {/*Note Editor* Done Button */}

                  <button
                    type="button"
                    onClick={(e) => {
                      if (confirm("Are you sure you want to proceed?")) {
                        setUpdateFollowupDone(true);
                      } else {
                        updateTextArea(e, close, "dont set date", {
                          id: each.id,
                          field: "coachNotes",
                          followupId: each.followupId,
                          leadStage: each.stage,
                        });
                      }
                    }}
                    className="done-btn"
                  >
                    Done
                  </button>
                </Fragment>
              ) : (
                <Fragment>
                  <h3 className="set-followup-date-text">
                    Set Next Followup Date{" "}
                  </h3>
                  <input
                    type="date"
                    value={addDateForNextFollowup}
                    onChange={(e) => setAddDateForNextFollowup(e.target.value)}
                    className="popup-date-picker mb-3 mt-2"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      updateTextArea(e, close, "set date", {
                        id: each.id,
                        field: "coachNotes",
                        followupId: each.followupId,
                        leadStage: each.stage,
                      });
                    }}
                    className="done-btn"
                  >
                    Done
                  </button>
                </Fragment>
              )}
            </div>
          )}
        </Popup>

        <Popup
          modal
          trigger={
            <button
              className="snooze-button"
              style={{ color: each.level === "Cold" ? "#80288F" : "#fff" }}
            >
              <LuBellRing className="tick-icon" />
              Snooze
            </button>
          }
        >
          {(close) => (
            <div className="timer-popup">
              <h3>Set The Time </h3>
              {/* Input Timer */}
              <input
                type="time"
                value={each.time}
                style={{ textAlign: "center" }}
                onChange={(e) => {
                  // console.log(each, "dfddsanju");
                  setDashboardFollowups((prevData) =>
                    prevData.map((item) => {
                      return item.id === each.id
                        ? { ...item, time: e.target.value }
                        : item;
                    })
                  );
                  // console.log(each, "dfddsanju");
                  // setTimer(e.target.value);
                }}
                className="timer-container"
              />
              {timerError && <p>{timerError}</p>}
              {/* Input Popup Done button */}
              <button
                onClick={(e) => {
                  updateTextArea(e, close, "", {
                    id: each.id,
                    field: "time",

                    followupId: each.followupId,
                    leadStage: each.stage,
                  });
                }}
                className="timer-popup__done-btn"
              >
                Done
              </button>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

const MemoizedFollowupCard = React.memo(FollowupCard);
export default MemoizedFollowupCard;
