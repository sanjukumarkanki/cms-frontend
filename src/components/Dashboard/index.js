import React, {Fragment, useEffect, useState}from 'react'
import './index.css'
// import { CascadeSelect } from 'primereact/cascadeselect';
import { CascadeSelect } from 'primereact/cascadeselect';
import { SlRefresh } from "react-icons/sl";
import FollowupCard from '../FollowupCard';
import Navbar from '../Navbar';
import { baseUrl } from '../../App';
import { toast } from 'react-toastify';

const filters = [
    {
        name: 'Coach',
        code: 'AU',
        states: [
          {cname: 'Ruthvik', code: 'A-SY'},
          {cname: 'Mustafa', code: 'A-NE'},
          {cname: 'Rani', code: 'A-WO'}
        ]
    },
    {
        name: 'Stage',
        code: 'US',
        states: [
          {cname: 'Lead', code: 'A-SY'},
          {cname: 'Op', code: 'A-NE'},
          {cname: 'Diag', code: 'A-WO'},
          {cname: 'Ip', code: 'A-WO'}
        ]
    },
    {
      name: 'Lead',
      code: 'US',
      states: [
        {cname: 'Very Hot', code: 'A-SY'},
        {cname: 'Hot', code: 'A-NE'},
        {cname: 'Cold', code: 'A-WO'},
        {cname: 'closed', code: 'A-WO'}
      ]
  }
];


const Dashboard = () => {
  const [DashboardFollowUps,setDashboardFollowups] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterButton, setFilterButton] = useState("");
  const [filterdCards, setFilteredCards] = useState("")


  useEffect(() => {
    const getFollowups = async () => {
      try{
        const fetchDetails = await fetch(`${baseUrl}/dashboard-followups`)
        if(fetchDetails.ok){
          const data = await fetchDetails.json()
          setDashboardFollowups(data)
          setFilteredCards(data)
        }
        }
        catch(err){
          toast.error("Failed To Get Followups")
        }
      }
    getFollowups()
  }, [])

  const onFilter = () => {
    const dropdownElement = document.getElementById("filterDropdown");
    dropdownElement.classList.toggle("dorpdown");

  }


  const onDropDownClick = (e) => {
    setSelectedCity(e.value.cname)
    if(e.value.cname === "Ruthvik" || e.value.cname === "Mustafa" || e.value.cname === "Rani"){
      const filterByCoach = DashboardFollowUps.filter(each => each.coachName === e.value.cname);
        setFilteredCards(filterByCoach, 'filter')
    }
    else if(e.value.cname === "Lead" || e.value.cname === "Op" || e.value.cname === "Ip" || e.value.cname === "Diag"){
      const filterByCoach = DashboardFollowUps.filter(each => each.stage === e.value.cname);
        setFilteredCards(filterByCoach, 'filter')
    }else if(e.value.cname === "Very Hot" || e.value.cname === "Hot" || e.value.cname === "Cold" || e.value.cname === "closed"){
      const filterByCoach = DashboardFollowUps.filter(each => each.level === e.value.cname);
        setFilteredCards(filterByCoach)
    }

  }



  return (
    <div className='patient-dashboard'>
              <Navbar title="Patient Dashboard" />
    <div className='patient-dashboard__sub-heading'>
      <div className='patient-dashboard__btn-container'>
        <button className='patient-dashboard-refresh-btn' onClick={() => {
          window.location.reload()
        }}>
        <SlRefresh className='patient-dashboard__btn-icon' />
            Refresh
        </button>

        <CascadeSelect 
          value={selectedCity} 
          onChange={onDropDownClick} // Accessing the name property of the parent item
          options={filters} 
          optionLabel="cname" 
          optionGroupLabel="name" 
          optionGroupChildren={['states']}
          breakpoint="767px" 
          placeholder="Filter" 
      />
      </div>
    </div>

    <div className='patient-dashboard__followup-cards'>
    {DashboardFollowUps.length > 0 ? 
      <div className='patient-dashboard__followup-cards-container'>
        <Fragment>
          {filterdCards.length > 0 ?
            <Fragment>
            {filterdCards.map((each, index) => 
              <FollowupCard each={each} index={index} />
          )}
            </Fragment> : <div>
             No Followups</div>
          }
        </Fragment>
      </div>
      : null}
  </div>


    </div>
  )
}



export default Dashboard


  //   <div class="dropdown">
  //   <button class="dropdown-btn" onclick="toggleDropdown()">
  //     Dashboard
  //     <span class="material-symbols-outlined expand-icon"> expand_more </span>
  //   </button>

  //   <div class="dropdown-content" id="myDropdown">
  //     <a href="#">
  //       <span class="material-symbols-outlined"> cottage </span>
  //       Home
  //     </a>
  //     <a href="#">
  //       <span class="material-symbols-outlined">category</span>
  //       Products
  //     </a>
  //     <a href="#">
  //       <span class="material-symbols-outlined">donut_large</span>
  //       Services
  //     </a>

  //     <div class="nested-dropdown">
  //       <a href="#">
  //         <span class="material-symbols-outlined">contact_support</span>
  //         Contact Us
  //       </a>

  //       <div class="nested-dropdown-content">
  //         <a href="#">
  //           <span class="material-symbols-outlined">contact_mail</span>
  //           Contact Information
  //         </a>
  //         <a href="#">
  //           <span class="material-symbols-outlined">unknown_document</span>
  //           Inquiry Form
  //         </a>
  //         <a href="#">
  //           <span class="material-symbols-outlined">explore</span>
  //           Visit Us
  //         </a>
  //       </div>
  //     </div>

  //     <a href="#">
  //       <span class="material-symbols-outlined">info</span>
  //       About Us
  //     </a>
  //   </div>
  // </div>


  
    

