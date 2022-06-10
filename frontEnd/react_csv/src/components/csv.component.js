 import React, { Component } from 'react'

 import axios from 'axios';
 import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
 
import ProgressBar from "@ramonak/react-progress-bar";
import 'bootstrap/dist/css/bootstrap.min.css';
 
function Notify() {
  toast.success("Dawnloaded successfully",{
    position: toast.POSITION.TOP_CENTER,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    autoClose: 3000
  });
}
export default class csv extends Component {
 render() {
    const BASE_URL = 'http://localhost:5001/chapperone-6a910/us-central1/api'
   
    const hadnleGeneratOrgInfo = async ()=>{
    
      const res = await fetch(`${BASE_URL}/all_organization?csv=true`);
      const blob = await res.blob();
        
      // create a url for the blob
      const downloadUrl = URL.createObjectURL(blob);
      console.log("--->", res)
      // create an a tag Element
      const a = document.createElement('a');
      // add an href
      a.href = downloadUrl;
      a.target = '_blank';
      a.download = 'organization_info.csv';
      <ProgressBar completed={180} maxCompleted={200} />
      a.click();
    
     Notify();
      // revoke the url that has been created
      URL.revokeObjectURL(downloadUrl);
    }

    const hadnleGeneratAllTripParticipantUsers = async ()=>{
      const res = await fetch(`${BASE_URL}/all_users?csv=true`);
      const blob = await res.blob();
        
      // create a url for the blob
      const downloadUrl = URL.createObjectURL(blob);
      console.log("--->", res)
      // create an a tag Element
      const a = document.createElement('a');
      // add an href
      a.href = downloadUrl;
      a.target = '_blank';
      a.download = 'user_info.csv';

      a.click();
      Notify();
      // revoke the url that has been created
      URL.revokeObjectURL(downloadUrl);
    }

    const hadnleGeneratAllTripInfo = async ()=>{
      const res = await fetch(`${BASE_URL}/all_trips?csv=true`);
      const blob = await res.blob();        
      // create a url for the blob
      const downloadUrl = URL.createObjectURL(blob);
      console.log("--->", res)
      // create an a tag Element
      const a = document.createElement('a');
      // add an href
      a.href = downloadUrl;
      a.target = '_blank';
      a.download = 'trip_info.csv';
   
      a.click();
      Notify();
      // revoke the url that has been created
      URL.revokeObjectURL(downloadUrl);
    }
 // render() {
    return (
      <>
      <ToastContainer />
        <h3>Chapperone's Data</h3>
        <div className="mb-3">
          <label>User List</label>
          <div className="d-grid">
          <button type="submit" onClick={hadnleGeneratAllTripParticipantUsers}  className="btn btn-dark">
          Generate Trip Users CSV
          </button>
        </div>
        </div>
        <div className="mb-3">
          <label>Organization List</label>
          <div className="d-grid">
          <button onClick={hadnleGeneratOrgInfo} className="btn btn-dark">
          Generate Organizations CSV 
          </button>
        </div>
        </div>
        
      
        <div className="mb-3">
          <label>Trip List</label>
          <div className="d-grid">
          <button onClick={hadnleGeneratAllTripInfo} className="btn btn-dark">
          Generate Trip Information Csv
          </button>
        </div>
        </div>
       </>

    )
  }
} 