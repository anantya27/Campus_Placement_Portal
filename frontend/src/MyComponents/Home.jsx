import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
// import './Editor.css'

function Home({uuid}) {

  const navigate=useNavigate();// should only be called inside functional component function
 

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const createNewRoom = (e) => {
      e.preventDefault();
      const id = uuid();
      setRoomId(id);
      toast.success('Created a new room');
  };

  const joinRoom = () => {
      if (!roomId || !username) {
          toast.error('ROOM ID & username is required');
          return;
      }

      // Redirect
      navigate(`/${roomId}`, {
          state: {
              username,
          },
      });
  };

  const handleInputEnter = (e) => {
      if (e.code === 'Enter') {
          joinRoom();
      }
  };

  // const handleRoomJoin =(e)=>{
      
  //     e.preventDefault();

  //     // const roomId=uuid();
  //     // navigate(`/${roomId}`);
  //     // console.log(roomData);
  //     // socket.emit("userJoined",roomData);
  // }

  return (
    // <div>
    //   <button type="submit" onClick={handleRoomJoin}  className="mt-4 btn btn-primary btn-block form-control">Join Room</button>
    // </div>
    <div className="homePageWrapper">
            <div className="formWrapper">
                <img
                    className="homePageLogo"
                    src="/code-sync.png"
                    alt="code-sync-logo"
                />
                {/* <h4 className="mainLabel" style={{color: '#4aee88'}}>Campus Placement Portal </h4> */}
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            // href=""
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>
                    Built with 💛 by 
                    <a href="https://github.com/anantya27/Campus_Placement_Portal"> Anantya & Akul</a>
                </h4>
            </footer>
    </div>
  )
}

export default Home;