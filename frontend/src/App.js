import React from 'react'
import "./App.css"
import { Route, Routes } from 'react-router-dom';
import {v4 as uuid} from "uuid";
import io from "socket.io-client";
import { Toaster } from 'react-hot-toast';


import Home from "./MyComponents/Home";
import Room from "./MyComponents/Room";
import Container from './MyComponents/WhiteBoardComponent/container/Container';
import Profile from './MyComponents/ProfilesComponent/Profile';
import EditorHome from './MyComponents/IdeComponent/pages/EditorHome'
import EditorPage from './MyComponents/IdeComponent/pages/EditorPage'
import VideoCapture from './VideoCapture';


function App() {

  const socket=io("http://localhost:3030");
  socket.emit("connection");
  // useEffect(() => {
    
  //   socket.on("userIsJoined",(data)=>{
  //     if(data.success){
        
  //       console.log("userJoined",data.user);
  //       setUsers(data.users);
  //     }
  //     else{
  //       console.log("userJoined error");
  //     }
  //   })

  //   socket.on("allUsers", (data) =>{
  //     console.log("allUsers>>>>>>>>>>>>>>>>",data);
  //     setUsers(data);
  //   });

  //   socket.on("userJoinedMessageBroadcasted",(name)=>{
  //     console.log(`${name} joined the room`);
  //     // toast.info(`${name} joined the room`);
      
  //     toast.info(`${name} joined the room`);
  //   });


  // }, [])

  return (
    <>
      <div>
          <Toaster
              position="top-right"
              toastOptions={{
                  success: {
                      theme: {
                          primary: '#4aed88',
                      },
                  },
              }}
          ></Toaster>
      </div>

      <Routes>
        <Route path="/" element={ <Home uuid={uuid} /> }></Route>
        <Route path="/:roomId" element={ <Room socket={socket} />  }></Route>
        {/* <Route path="/whiteboard/:roomId" element={ <WhiteboardComp socket={socket} />  }></Route> */}
        <Route path="/whiteboard/:roomId" element={ <Container socket={socket} />  }></Route>
        
        <Route path="/Ide" element={ <EditorHome/>  }></Route>
        <Route path="/Ide/:roomId" element={ <EditorPage socket={socket}/> }></Route>
        
        <Route path="/Profiles/:roomId" element={ <Profile/>  }></Route>
        <Route path="/test" element={ <VideoCapture/>  }></Route>
      </Routes>

    </>
   
  )
}

export default App;


