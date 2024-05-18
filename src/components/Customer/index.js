import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowupTable from "../FollowupTable";

import "./index.css";
import MemoizedInputComponent from "../InputComponent";
import MemoizedSelectComponent from "../SelectComponent";
import Navbar from "../Navbar";
import { fetchData } from "../../ApiRoutes";
import { getRequestHeaders } from "../../App";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

// To format the date
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const Customer = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);

  // To get all the userDetails
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const fetchUserDetails = await fetchData(
          `patiens/${id}`,
          getRequestHeaders
        );
        setUserData([fetchUserDetails]);
      } catch (err) {
        toast.error("Failed To get Patient Details");
      }
    };

    getUserDetails();
  }, []);

  return (
    <Fragment>
      <Navbar title="Patient Details" />
      {userData.length > 0 ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0.5rem",
          }}
        >
          {/* Patient Name and Phone Number Container */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details-name-container">
              <MemoizedInputComponent
                type="text"
                keyName="patientName"
                id={id}
                value={userData[0].patientName}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details-phone-container">
              <MemoizedInputComponent
                type="text"
                keyName="phoneNumber"
                id={id}
                value={userData[0].phoneNumber}
                setUserData={setUserData}
              />
            </div>
          </div>
          {/* Caller Name and Date Of Contact Container */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details-name-container">
              <MemoizedInputComponent
                type="text"
                keyName="callerName"
                id={id}
                value={userData[0].callerName}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details-phone-container">
              <MemoizedInputComponent
                type="date"
                keyName="dateOfContact"
                id={id}
                value={formatDate(new Date(userData[0].dateOfContact))}
                setUserData={setUserData}
              />
            </div>
          </div>
          {/* Lead Channel and Date Of Contact Container */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details__lead-channel-container">
              <MemoizedSelectComponent
                keyName="leadChannel"
                id={id}
                dropdownOptions={[
                  "Web Form",
                  "WhatsApp",
                  "Call",
                  "Just Dial",
                  "Walk In",
                  "Referral",
                  "GMB",
                  "Social Media",
                  "YouTube",
                ]}
                value={userData[0].leadChannel}
                setUserData={setUserData}
              />
            </div>

            <div className="patient-details__campaign-container">
              <MemoizedSelectComponent
                keyName="campaign"
                id={id}
                dropdownOptions={[
                  "Organic",
                  "Op",
                  "PET CT",
                  "Biopsy",
                  "Surgery",
                  "Influencer",
                  "Pediatric",
                ]}
                value={userData[0].campaign}
                setUserData={setUserData}
              />
            </div>
          </div>
          {/* Coach Name And Age Container  */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details__lead-channel-container">
              <MemoizedSelectComponent
                keyName="coachName"
                id={id}
                dropdownOptions={["Mustafa", "Rani", "Ruthvik"]}
                value={userData[0].coachName}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details__age-gender-container">
              <div className="patient-details__age-container">
                <MemoizedInputComponent
                  type="text"
                  id={id}
                  setUserData={setUserData}
                  value={userData[0].age}
                  keyName={"age"}
                />
              </div>
              <div className="patient-details__gender-container">
                <MemoizedSelectComponent
                  keyName="gender"
                  id={id}
                  dropdownOptions={["Male", "Female", "Others"]}
                  value={userData[0].gender}
                  setUserData={setUserData}
                />
              </div>
            </div>
          </div>
          {/*Type Of Cancer  And Location Container  */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details-name-container">
              <MemoizedInputComponent
                type="text"
                keyName="typeOfCancer"
                id={id}
                setUserData={setUserData}
                value={userData[0].typeOfCancer}
              />
            </div>
            <div className="patient-details-phone-container">
              <MemoizedInputComponent
                type="text"
                value={userData[0].location}
                keyName="location"
                setUserData={setUserData}
                id={id}
              />
            </div>
          </div>
          {/*Email  And Relation To Patient Container  */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details-name-container">
              <MemoizedInputComponent
                value={userData[0].email}
                type="text"
                keyName="email"
                id={id}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details__campaign-container">
              <MemoizedSelectComponent
                keyName="relationsToPatient"
                id={id}
                dropdownOptions={[0, 1]}
                value={userData[0].relationsToPatient}
                setUserData={setUserData}
              />
            </div>
          </div>
          {/*Inbound   And Relevant  Container  */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details__lead-channel-container">
              <MemoizedSelectComponent
                keyName="inboundOutbound"
                id={id}
                dropdownOptions={[0, 1]}
                value={userData[0].inboundOutbound}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details__campaign-container">
              <MemoizedSelectComponent
                keyName="relevant"
                id={id}
                dropdownOptions={[0, 1]}
                value={userData[0].relevant}
                setUserData={setUserData}
              />
            </div>
          </div>
          {/*Intrested  And Conv Container  */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details__lead-channel-container">
              <MemoizedSelectComponent
                keyName="interested"
                id={id}
                dropdownOptions={[0, 1]}
                value={userData[0].interested}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details__campaign-container">
              <MemoizedSelectComponent
                keyName="conv"
                id={id}
                dropdownOptions={[0, 1]}
                value={userData[0].conv}
                setUserData={setUserData}
              />
            </div>
          </div>

          {/* Preop and Level And Stage Container  */}

          <div className="patient-details__name-phone-container">
            <div className="patient-details__preop-container">
              <MemoizedSelectComponent
                keyName="preOp"
                id={id}
                dropdownOptions={[0, 1]}
                value={userData[0].preOp}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details__level-container">
              <MemoizedSelectComponent
                keyName="level"
                id={id}
                dropdownOptions={["Very Hot", "Hot", "Cold", "Closed"]}
                value={userData[0].level}
                setUserData={setUserData}
              />
            </div>
            <div className="patient-details__stage-container">
              <MemoizedSelectComponent
                keyName="stage"
                id={id}
                value={userData[0].stage}
                setUserData={setUserData}
                dropdownOptions={["Lead", "Op", "Diag", "Ip"]}
              />
            </div>
          </div>
          {/* Coach Notes */}
          <div className="patient-details__name-phone-container">
            <div className="patient-details-coach-note-container">
              <MemoizedInputComponent
                type="textarea"
                value={userData[0].coachNotes}
                keyName="coachNotes"
                id={id}
                setUserData={setUserData}
              />
            </div>
          </div>

          {/* FollowUp Table */}
          <div className="followup-table-container">
            <h3 className="followup-table-container__heading">
              Followup's Table
            </h3>
            <FollowupTable leadId={id} />
          </div>
        </div>
      ) : (
        <div className=" w-100 p-3">
          {/* Skeleton Loader */}
          {Array.from({ length: 6 }).map((Each) => (
            <div className="d-flex mb-3 justify-content-center align-items-center ">
              <div className=" d-flex justify-content-start align-items-center ">
                <Skeleton
                  width="4.53rem"
                  className=" mx-3"
                  borderRadius="0.1rem"
                />
                <Skeleton width="9.03rem" borderRadius="0.1rem" />
              </div>
              <div className=" d-flex justify-content-start align-items-center ">
                <Skeleton
                  width="4.53rem"
                  className=" mx-3"
                  borderRadius="0.1rem"
                />
                <Skeleton width="9rem" borderRadius="0.1rem" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default Customer;
