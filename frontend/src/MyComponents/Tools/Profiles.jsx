import React from 'react'
import { useNavigate } from "react-router-dom";

function Profiles({roomId}) {

  const navigate=useNavigate();

  const handleProfiles =(e)=>{
    navigate(`/Profiles/${roomId}`);
  }

  return (
    <div className="main__controls__button" onClick={handleProfiles}>
        <i className="fas fa-user-friends"></i>
        <span>Profile</span>
    </div>
  )
}

export default Profiles