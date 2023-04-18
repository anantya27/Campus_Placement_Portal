import React, { useState, useEffect, useRef } from "react";
import Client from "../Comp/Client";
import Editor from "../Comp/Editor";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import logo from "../../../logo.png";
import toast from "react-hot-toast";

function EditorPage({ socket }) {
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const codeRef = useRef(null);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    socket.on("connect_error", (err) => handleErrors(err));
    socket.on("connect_failed", (err) => handleErrors(err));

    function handleErrors(e) {
      console.log("socket error", e);
      toast.error("Socket connection failed, try again later.");
      reactNavigator("/");
    }
    socket.emit("ide-join", { roomId, username: null });
    //this wont work with room i guess
    // socket.emit("ide-join");

    // Listening for joined event
    socket.on("user-joined", ({ clients, username, socketId }) => {
      // if (username !== location.state?.username) {
      //   toast.success(`${username} joined the room.`);
      //   console.log(`${username} joined`);
      // }
      setClients(clients);
      socket.emit("sync-code", {
        code: codeRef.current,
        socketId,
      });
    });

    // Listening for disconnected
    socket.on("disconnected", ({ socketId, username }) => {
      toast.success(`${username} left the room.`);
      setClients((prev) => {
        return prev.filter((client) => client.socketId !== socketId);
      });
    });

    return () => {
      socket.disconnect();
      socket.off("user-joined");
      socket.off("disconnected");
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  //   if(!location.state){
  //     return <Navigate to="/"/>
  //   }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="homePageLogo" src={logo} alt="code-sync-logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socket={socket}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
}

export default EditorPage;
