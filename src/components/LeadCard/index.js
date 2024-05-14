import React from "react";
import "./index.css";
import EditableCell from "../EditableCell";

const LeadCard = ({ eachLeadData }) => {
  function onSave(phoneNumber, value, id) {
    eachLeadData[phoneNumber] = value;
  }

  return (
    <tr className="table-body__container">
      {Object.entries(eachLeadData).map(([key, value]) => (
        <EditableCell
          key={key}
          value={value}
          id={key}
          onSave={(updatedValue) => onSave(key, updatedValue)}
        />
      ))}
    </tr>
  );
};

export default LeadCard;

// <div>
// <p>{lead_id}</p>
// <EditableCell value={phone_number} id={phone_number} onSave={(value) => onSave('phone_number', value)} />
// <EditableCell value={callback} onSave={(value) => onSave('callback', value)} />
// <EditableCell value={caller_name} onSave={(value) => onSave('caller_name', value)} />
// <EditableCell value={age} onSave={(value) => onSave('age', value)} />
// <EditableCell value={campaign} onSave={(value) => onSave('campaign', value)} />
// <EditableCell value={coach_name} onSave={(value) => onSave('coach_name', value)} />
// <EditableCell value={coach_notes} onSave={(value) => onSave('coach_notes', value)} />
// <EditableCell value={conv} onSave={(value) => onSave('conv', value)} />
// <EditableCell value={date_of_contact} onSave={(value) => onSave('date_of_contact', value)} />
// <EditableCell value={email} onSave={(value) => onSave('email', value)} />
// <EditableCell value={gender} onSave={(value) => onSave('gender', value)} />
// <EditableCell value={inbound_outbound} onSave={(value) => onSave('inbound_outbound', value)} />
// <EditableCell value={interested} onSave={(value) => onSave('interested', value)} />
// <EditableCell value={lead_channel} onSave={(value) => onSave('lead_channel', value)} />
// <EditableCell value={level} onSave={(value) => onSave('level', value)} />
// <EditableCell value={location} onSave={(value) => onSave('location', value)} />
// <EditableCell value={patient_name} onSave={(value) => onSave('patient_name', value)} />
// <EditableCell value={pre_op} onSave={(value) => onSave('pre_op', value)} />
// <EditableCell value={relations_to_patient} onSave={(value) => onSave('relations_to_patient', value)} />
// <EditableCell value={relevant} onSave={(value) => onSave('relevant', value)} />
// <EditableCell value={stage} onSave={(value) => onSave('stage', value)} />
// <EditableCell value={type_of_cancer} onSave={(value) => onSave('type_of_cancer', value)} />
// </div>
