import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import FollowupTable from "../FollowupTable";

import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "./index.css";
import InputComponent from "../InputComponent";
import SelectedComponent from "../SelectComponent";
import Navbar from "../Navbar";
import { baseUrl } from "../../App";

const Customer = () => {
  const { id } = useParams();
  const [customeData, setCustomerData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});

  return (
    <Fragment>
      <Navbar title="Patient Details" />

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="patient-details__name-phone-container">
          <div className="patient-details-name-container">
            <InputComponent type="text" keyName="patientName" id={id} />
          </div>
          <div className="patient-details-phone-container">
            <InputComponent type="text" keyName="phoneNumber" id={id} />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details-name-container">
            <InputComponent type="text" keyName="callerName" id={id} />
          </div>
          <div className="patient-details-phone-container">
            <InputComponent type="date" keyName="dateOfContact" id={id} />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details__lead-channel-container">
            <SelectedComponent
              keyName="leadChannel"
              id={id}
              dropdownOptions={[
                "Web Form",
                "Whatsapp",
                "call",
                "Just Dial",
                "Walk In",
                "Referral",
                "Gmb",
                "Social Media",
                "Youtube",
              ]}
            />
          </div>

          <div className="patient-details__campaign-container">
            <SelectedComponent
              keyName="campaign"
              id={id}
              dropdownOptions={[
                "Organic",
                "Op",
                "Pet Ct",
                "Biopsy",
                "Surgery",
                "Influencer",
                "Pediatric",
              ]}
            />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details__lead-channel-container">
            <SelectedComponent
              keyName="coachName"
              id={id}
              dropdownOptions={["Mustafa", "Rani", "Ruthvik"]}
            />
          </div>
          <div className="patient-details__age-gender-container">
            <div className="patient-details__age-container">
              <InputComponent type="text" id={id} keyName={"age"} />
            </div>
            <div className="patient-details__gender-container">
              <SelectedComponent
                keyName="gender"
                id={id}
                dropdownOptions={["Male", "Female", "Others"]}
              />
            </div>
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details-name-container">
            <InputComponent type="text" keyName="typeOfCancer" id={id} />
          </div>
          <div className="patient-details-phone-container">
            <InputComponent type="text" keyName="location" id={id} />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details-name-container">
            <InputComponent type="text" keyName="email" id={id} />
          </div>
          <div className="patient-details__campaign-container">
            <SelectedComponent
              keyName="relationsToPatient"
              id={id}
              dropdownOptions={[0, 1]}
            />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details__lead-channel-container">
            <SelectedComponent
              keyName="inboundOutbound"
              id={id}
              dropdownOptions={[0, 1]}
            />
          </div>
          <div className="patient-details__campaign-container">
            <SelectedComponent
              keyName="relevant"
              id={id}
              dropdownOptions={[0, 1]}
            />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details__lead-channel-container">
            <SelectedComponent
              keyName="interested"
              id={id}
              dropdownOptions={[0, 1]}
            />
          </div>
          <div className="patient-details__campaign-container">
            <SelectedComponent
              keyName="conv"
              id={id}
              dropdownOptions={[0, 1]}
            />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details__preop-container">
            <SelectedComponent
              keyName="preOp"
              id={id}
              dropdownOptions={[0, 1]}
            />
          </div>
          <div className="patient-details__level-container">
            <SelectedComponent
              keyName="level"
              id={id}
              dropdownOptions={["Very Hot", "Hot", "Cold", "Closed"]}
            />
          </div>
          <div className="patient-details__stage-container">
            <SelectedComponent
              keyName="stage"
              id={id}
              dropdownOptions={["Lead", "Op", "Diag", "Ip"]}
            />
          </div>
        </div>

        <div className="patient-details__name-phone-container">
          <div className="patient-details-coach-note-container">
            <InputComponent type="textarea" keyName="coachNotes" id={id} />
          </div>
        </div>
      </div>

      {/* FollowUp Table */}
      <div className="followup-table-container">
        <h3 className="followup-table-container__heading">Followup's Table</h3>
        <FollowupTable leadId={id} />
      </div>
    </Fragment>
  );
};

export default Customer;
