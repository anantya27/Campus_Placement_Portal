import React from 'react'
import { useNavigate } from "react-router-dom";

function Ide({roomId}) {

  const navigate=useNavigate();

  const handleIde =(e)=>{
    navigate(`/Ide/${roomId}`);
  }

  return (
    <div className="main__controls__button" onClick={handleIde}>
        <i className="fas fa-comment-alt"></i>
        <span>IDE</span>
    </div>
  )
}

export default Ide;