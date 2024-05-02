import React from 'react'
import { useEffect,useState } from 'react'

import { Skeleton } from 'primereact/skeleton';
        
import './index.css';

import LeadTable  from '../LeadTable';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';
import { baseUrl } from '../../App';
// import GlobalStateContext from '../../contexts';

const AllLeads = () => {
  const [allLeadsList, setAllLeads] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false)
  

  useEffect(() => {
       const getAllLeads = async () => {
        try{
          const fetchData = await fetch(`${baseUrl}/get-leads`);
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

    }, []);

  return (
    <section className='leads-main-container'>
        <Navbar title="All Leads" />
          {
            allLeadsList.length > 0 ? 
            <LeadTable   />
           : 
           <Skeleton width="30.07rem" height="12.32rem" />
          }
    </section>
  )
}

export default AllLeads;