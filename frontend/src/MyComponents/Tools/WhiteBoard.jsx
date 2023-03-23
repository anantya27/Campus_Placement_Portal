import React from 'react'
import { useNavigate } from "react-router-dom";

function WhiteBoard({roomId}) {

  const navigate=useNavigate();
  const handleWhiteBoard =(e)=>{
      
    // e.preventDefault();

    
    navigate(`/whiteboard/${roomId}`);
    // console.log(roomData);
    // socket.emit("userJoined",roomData);
  }

  return (
        <div className="main__controls__button" onClick={handleWhiteBoard} >
            <i className="fas fa-shield-alt"></i>
            <span>WhiteBoard</span>
        </div>
  ) 
}

export default WhiteBoard;


// {/* <div className="main__controls__button">
        
//             <FontAwesomeIcon icon="fa-solid fa-chalkboard" size='lg' />
//             <span>Whiteboard</span>
//         </div>  */}