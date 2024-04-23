import React, { Fragment, useState, useEffect } from 'react';
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

const Customer = () => {
  const { id } = useParams();
  const [customeData, setCustomerData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3003/patiens/${id}`);
        if (response.ok) {
          const updateUserDetails = await response.json();
          setCustomerData([updateUserDetails]);
        } else {
          setErrorMessage(true);
        }
      } catch (err) {
        setErrorMessage(true);
        console.log(err.message);
      }
    };

    fetchDetails();
  }, [id]);

  const handleChange = (key, newValue) => {
    const updatedData = customeData.map(entry => {
      if (entry[key] !== undefined) {
        return { ...entry, [key]: newValue };
      }
      return entry;
    });
    setCustomerData(updatedData);
  };

  const seletedArray = {
    leadChannel: ["Web Form", "Whatsapp", "call", "Just Dial", "Walk Im", "Referral", "Gmb", "Social Media", "Youtube"],
    campaign: ["Organic", "Op", "Pet Ct", "Biopsy", "Surgery", "Influencer", "Pediatric"],
    coachName: ["Mustafa", "Rani", "Ruthvik"],
    gender: ["Male", "Female", "Others"],
    level: ["Very Hot", "Hot", "Cold", "closed"],
    stage: ["Lead", "Op", "Diag", "Ip"]
  };


  const onInputChange = (e, key) => {
    //  setSelectedOption(prev => ({ ...prev, [key]: e.value }))
     console.log(customeData[0].id, key, selectedOption)

     
  //   const makeFetchRequest = async () => {
  //   const options = {
  //     method : "PUT",
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     body : JSON.stringify({
  //         id : customeData.id,
  //         field : key,
  //         value : selectedOption
  //     })
  //   }

  //   try {
  //     const fetchRequest = await fetch("http://localhost:3003/update-lead", options);
  //     if (!fetchRequest.ok) {
  //         throw new Error('Failed to update lead');
  //     }
  //     else{
  //     toast.success('Updated Successfully', {
  //         position: "top-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "dark",
  //     })
  //     }
  //   } catch(err) {
  //   toast.warning("Update Unsuccessful.")
  //   }
  //   }

  // makeFetchRequest();

  }


  return (
    <Fragment>
      <Link to="/allleads" className='arrow-goback'>
        <button className='arrow-goback-left'><FaArrowLeft /></button>
      </Link>

      <h1 className='customer-table__heading'>Customer Details</h1>
      <div style={{ width: '100%' }}>
        {customeData.length > 0 ? (
          <div>
            {customeData.map((data, index) => (
              <div key={index} className='customer-details__item'>
                {Object.entries(data).map(([key, value]) => (
                  <div className='customer-details__property' key={key}>
                    <p className='customer-details__label'>{key}</p>
                    <Inplace style={{width : "100%"}}>
                      <InplaceDisplay style={{width : "100%"}} >{value}</InplaceDisplay>
                      <InplaceContent  style={{width : '100%'}}>
                        {(key === "leadChannel" || key === "coachName" || key === "campaign" || key === "level" || key === "stage") ?
                          <Dropdown
                            value={selectedOption[key]}
                            options={seletedArray[key].map(item => ({ label: item, value: item }))}
                            onChange={(e) => onInputChange(key)}
                            placeholder={`Select ${key}`}
                            style={{width : '100%'}}
                          /> :
                          <InputText
                            style={{ width: "100%" }}
                            value={value}
                            onChange={(e) => handleChange(key, e.target.value)}
                          />
                        }
                      </InplaceContent>
                    </Inplace>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading</p>
        )}
      </div>
      <div>
        <FollowupTable />
      </div>
    </Fragment>
  );
};

export default Customer;
