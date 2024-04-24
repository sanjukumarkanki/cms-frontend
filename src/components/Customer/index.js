import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import FollowupTable from '../FollowupTable';
import { FaArrowLeft } from "react-icons/fa";
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { toast } from 'react-toastify';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './index.css';
import InputComponent from '../InputComponent';
import SelectedComponent from '../SelectComponent';

const Customer = () => {
  const { id } = useParams();
  const [customeData, setCustomerData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const customerDataUpdate = useRef({
    phoneNumber: '',
    callerName: '',
    patientName: '',
    dateOfContact: '',
    leadChannel: '',
    campaign: '',
    coachName: '',
    age: 70,
    gender: 70,
    typeOfCancer: '',
    location: '',
    email: '',
    relationsToPatient: '',
    coachNotes: '',
    inboundOutbound: '',
    relevant: 1,
    interested: 0,
    conv: 0,
    preOp: '',
    level: '',
    stage: ''
  })

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3003/patiens/${id}`);
  //       if (response.ok) {
  //         const updateUserDetails = await response.json();
  //         setCustomerData([updateUserDetails]);
  //       } else {
  //         setErrorMessage(true);
  //       }
  //     } catch (err) {
  //       setErrorMessage(true);
  //       console.log(err.message);
  //     }
  //   };

  //   fetchDetails();
  // }, [id]);

  // console.log(customeData)

  // const handleChange = (key, newValue) => {
  //   const updatedData = customeData.map(entry => {
  //     if (entry[key] !== undefined) {
  //       return { ...entry, [key]: newValue };
  //     }
  //     return entry;
  //   });
  //   setCustomerData(updatedData);
  //   customerDataUpdate.current = updatedData
  // };

  // const seletedArray = {
  //   leadChannel: ["Web Form", "Whatsapp", "call", "Just Dial", "Walk Im", "Referral", "Gmb", "Social Media", "Youtube"],
  //   campaign: ["Organic", "Op", "Pet Ct", "Biopsy", "Surgery", "Influencer", "Pediatric"],
  //   coachName: ["Mustafa", "Rani", "Ruthvik"],
  //   gender: ["Male", "Female", "Others"],
  //   level: ["Very Hot", "Hot", "Cold", "closed"],
  //   stage: ["Lead", "Op", "Diag", "Ip"]
  // };


  // const onInputChange = (e, key) => {
  //  if(e.key === "Enter"){
  //   customerDataUpdate.current.key = e.target.value
  //  }
  // }

  // console.log(customerDataUpdate)


  return (
    <Fragment>
    <div className='customer-details-subheading'>
          <Link to="/allleads" className='arrow-goback'>
          <img src='https://res.cloudinary.com/deo74k78q/image/upload/v1713891289/Go_Back_pnxxyu.png' alt="go back icon" />
        </Link>

        <p className='customer-table__heading'>Patient Details</p>
    </div>


      <div style={{width : '100%', marginLeft : '1.37rem'}}>
          <div className='patient-details__name-phone-container'>
            <div className='patient-details-name-container'>
              <InputComponent type="text" keyName="patientName" id={id} />
            </div>
            <div className='patient-details-phone-container'>
            <InputComponent type="text" keyName="phoneNumber" id={id} />
            </div>
          </div>

          <div className='patient-details__name-phone-container'>
          <div className='patient-details-name-container'>
            <InputComponent type="text" keyName="callerName" id={id} />
          </div>
          <div className='patient-details-phone-container'>
          <InputComponent type="date" keyName="dateOfContact" id={id} />
          </div>
        </div>
        
          <div className='patient-details__name-phone-container'>
              <div className='patient-details__lead-channel-container'>
              <SelectedComponent keyName="leadChannel" id={id} dropdownOptions={["Web Form", "Whatsapp",
              "call","Just Dial","Walk Im", "Referral",
              "Gmb", "Social Media","Youtube"]} />
              </div>

              <div className='patient-details__campaign-container'>
              <SelectedComponent keyName="campaign" id={id} dropdownOptions={["Organic", "Op","Pet Ct",
              "Biopsy", "Surgery", "Influencer",
              "Pediatric"]} />
              </div>
          </div>    
      

          <div className='patient-details__name-phone-container'>
          <div className='patient-details__lead-channel-container'>
            <SelectedComponent keyName="coachName" id={id} dropdownOptions={["Mustafa", "Rani", "Ruthvik"]} />
          </div>
            <div className='patient-details__age-gender-container'>
              <div className='patient-details__age-container'>
                <InputComponent type="text" id={id} keyName={"age"} />
              </div>
              <div className='patient-details__gender-container'>
                <SelectedComponent keyName="gender" id={id} dropdownOptions={["Male", "Female", "Others"]} />
              </div>
            </div>
            </div>    
      

          <div className='patient-details__name-phone-container'>
            <div className='patient-details-name-container'>
              <InputComponent type="text" keyName="typeOfCancer" id={id}  />
            </div>
            <div className='patient-details-phone-container'>
              <InputComponent type="text" keyName="location" id={id} />
          </div>

        </div>

        <div className='patient-details__name-phone-container'>
          <div className='patient-details-name-container'>
            <InputComponent type="text" keyName="email" id={id}  />
          </div>
          <div className='patient-details__campaign-container'>
          <SelectedComponent  keyName="relationsToPatient" id={id} dropdownOptions={[0,1]} />
          </div>
        </div> 
        
        
        <div className='patient-details__name-phone-container'>
        <div className='patient-details__lead-channel-container'>
        <SelectedComponent keyName="inboundOutbound" id={id} dropdownOptions={[0,1]} />
        </div>
        <div className='patient-details__campaign-container'>
        <SelectedComponent keyName="relevant" id={id} dropdownOptions={[0,1]} />
        </div>
        </div>  


        <div className='patient-details__name-phone-container'>
        <div className='patient-details__lead-channel-container'>
        <SelectedComponent keyName="interested" id={id} dropdownOptions={[0,1]} />
        </div>
        <div className='patient-details__campaign-container'>
        <SelectedComponent keyName="conv" id={id} dropdownOptions={[0,1]} />
        </div>
        </div>  
        


        <div className='patient-details__name-phone-container'>
          <div className='patient-details__preop-container'>
            <SelectedComponent keyName="preOp" id={id} dropdownOptions={[0,1]} />
          </div>
          <div className='patient-details__level-container'>
            <SelectedComponent keyName="level" id={id} dropdownOptions={["Very Hot", "Hot", "Cold",
            "closed"]} />
          </div>
          <div className='patient-details__stage-container'>
           <SelectedComponent keyName="stage" id={id} dropdownOptions={["Lead", "Op","Diag","Ip"]} />
          </div>
      </div>    


      <div className='patient-details__name-phone-container'>
        <div className='patient-details-coach-note-container'>
           <InputComponent type="textarea" keyName="coachNotes" id={id}  />
        </div>
      </div>

      </div>
      <div>
        <FollowupTable />
      </div>
    </Fragment>
  );
};

export default Customer;
          //  <InputComponent keyName="campaign" id={id} />




        // <div className='patient-details__name-phone-container'>
        //     <InplaceContent keyName="email" id={id}  />
        //     <SelectedComponent keyName="relationsToPatient" id={id} />
        // </div>

        // <div className='patient-details__name-phone-container'>
        // <SelectedComponent keyName="inboundOutbound" dropdownOptions={["0","1"]} id={id} />
        // <SelectedComponent keyName="relevant" dropdownOptions={["0","1"]} id={id} />
        // </div>

        // <div className='patient-details__name-phone-container'>
        //     <SelectedComponent keyName="interested" dropdownOptions={["0","1"]} id={id} />
        //     <SelectedComponent keyName="conv" dropdownOptions={["0","1"]} id={id} />
        // </div>

        // <div className='patient-details__name-phone-container'>
        // <SelectedComponent keyName="preOp" dropdownOptions={["0","1"]} id={id} />
        // <SelectedComponent keyName="level" dropdownOptions={["Very Hot", "Hot", "Cold",
        // "closed"]} id={id} />
        // <SelectedComponent keyName="stage" id={id} dropdownOptions={["Lead", "Op","Diag","Ip"]} />
        // </div>


      //   <div className='patient-details__name-phone-container'>
      //   <SelectedComponent keyName="coachName" id={id} dropdownOptions={["Mustafa", "Rani", "Ruthvik"]} />
      //   <InputComponent keyName="age" id={id} />
      //   <SelectedComponent keyName="gender" id={id} dropdownOptions={["Male", "Female", "Others"]} />
      // </div>
