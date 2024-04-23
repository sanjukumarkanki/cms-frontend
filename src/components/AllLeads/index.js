import React from 'react'
import { useEffect,useState } from 'react'
import './index.css';

import LeadTable from '../LeadTable';
import { toast } from 'react-toastify';
// import GlobalStateContext from '../../contexts';

const AllLeads = () => {
  const [allLeadsList, setAllLeads] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false)

  useEffect(() => {
       const getAllLeads = async () => {
        try{
          const fetchData = await fetch('http://localhost:3003/get-leads');
          if(fetchData.ok){
            const response = await fetchData.json();
            setAllLeads(response)
          }else{
            const response = await fetchData.json();
            setErrorMessage(response.message)
          }
        }
        catch(e){
          toast.warning("Network Error");
        }
       }

       getAllLeads()

    }, [])

  return (
    <section className='leads-main-container'>
        <div className='leads-main-container__sub-heading'>
            <h1>All Leads</h1>
        </div>  
          {
            allLeadsList.length > 0 ? 
            <LeadTable   />
           : 
          <div class="loader">
              <span class="loader-text">loading</span>
              <span class="load"></span>
          </div>
       
          }
    </section>
  )
}

export default AllLeads;