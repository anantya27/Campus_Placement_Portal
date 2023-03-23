import React from 'react'
import { useNavigate } from "react-router-dom";

function Home({uuid}) {

  const navigate=useNavigate();// should only be called inside functional component function

  const handleRoomJoin =(e)=>{
      
      e.preventDefault();

      const roomId=uuid();
      navigate(`/${roomId}`);
      // console.log(roomData);
      // socket.emit("userJoined",roomData);
  }

  return (
    <div>
      <button type="submit" onClick={handleRoomJoin}  className="mt-4 btn btn-primary btn-block form-control">Join Room</button>
    </div>
  )
}

export default Home;