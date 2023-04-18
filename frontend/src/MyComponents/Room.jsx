import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
// import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import MainTools from "./MainTools";

function Room({ socket }) {
  const { roomId } = useParams();
  // console.log(roomId);
  // const socket=io("http://localhost:3030");

  const [streamCreated, setStreamCreated] = useState(false);
  const [text, setText] = useState("");
  // const [myStream, setMyStream] = useState({})
  const myStream = useRef({});

  const myVideo = document.createElement("video");
  myVideo.muted = true;
  let myVideoStream;

  useEffect(() => {
    const videoGrid = document.getElementById("video-grid");

    var peer = new Peer(undefined, {
      path: "/peerjs",
      host: "/",
      port: "3030",
    });

    if (!streamCreated) {
      setStreamCreated(true);
      // console.log("hello",streamCreated);
      //This is a promise
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          myVideoStream = stream;
          // setMyStream(stream);
          myStream.current = stream;
          // console.log(stream);
          // console.log(myStream);
          // console.log("stream created");
          addVideoStream(myVideo, stream);

          socket.on("user-connected", (userId) => {
            // console.log("connected");
            connectToNewUser(userId, stream);
          });
        });
    }

    const addVideoStream = (video, stream) => {
      // console.log("stream added");
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });

      videoGrid.append(video);
    };

    peer.on("open", (id) => {
      // console.log(id);
      socket.emit("join-room", roomId, id);
    });
    // socket.emit("join-room",roomId);

    peer.on("call", (call) => {
      // console.log("1");
      call.answer(myVideoStream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // socket.on('user-connected',(userId) =>{
    //   // console.log("connected");
    //   connectToNewUser(userId,myVideoStream);
    // })

    const connectToNewUser = (userId, myVideoStream) => {
      // console.log("2");
      console.log(userId);
      const call = peer.call(userId, myVideoStream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        //problem
        addVideoStream(video, userVideoStream);
      });
      // call.on('close', () => {
      //  video.remove()
      // })

      // peers[userId] = call
    };

    socket.on("createMessage", (message) => {
      $("ul").append(`<li class="message"> <b>user</b><br> ${message} </li>`);

      console.log("Server>>>>>>>>>>>>>>>", message);
      scrollToBottom();
    });

    const scrollToBottom = () => {
      let d = $(".main__chat_window");
      d.scrollTop(d.prop("scrollHeight"));
    };

    let text1 = $("input");

    $("html").keydown((e) => {
      if (e.which == 13 && text1.val().length !== 0) {
        console.log(text1.val());
        socket.emit("message", text1.val());
        setText("");
      }
    });
  }, []);

  const muteUnmute = () => {
    const enabled = myStream.current.getAudioTracks()[0].enabled;
    if (enabled) {
      myStream.current.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myStream.current.getAudioTracks()[0].enabled = true;
    }
  };

  const playStop = () => {
    let enabled = myStream.current.getVideoTracks()[0].enabled;
    if (enabled) {
      myStream.current.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      myStream.current.getVideoTracks()[0].enabled = true;
    }
  };

  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `;
    document.querySelector(".main__mute_button").innerHTML = html;
  };

  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
    document.querySelector(".main__mute_button").innerHTML = html;
  };

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
    document.querySelector(".main__video_button").innerHTML = html;
  };

  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
    document.querySelector(".main__video_button").innerHTML = html;
  };

  const handleKeyPress = (event) => {
    //   // socket.emit('test');
    //   if( event.key === 'Enter' && text.length!==0 ){
    //     const message =text;
    //     console.log(message);
    //     socket.emit('message',message);
    //     setText("");
    //   }
  };

  return (
    // <div id="video-grid">

    // </div>

    <div className="main">
      <div className="main__left">
        <div className="main__videos">
          <div id="video-grid"></div>
        </div>

        <div className="main__controls">
          <div className="main__controls__block">
            <div
              onClick={muteUnmute}
              className="main__controls__button main__mute_button"
            >
              <i className="fas fa-microphone"></i>
              <span>Mute</span>
            </div>
            <div
              onClick={playStop}
              className="main__controls__button main__video_button"
            >
              <i className="fas fa-video"></i>
              <span>Stop Video</span>
            </div>
          </div>
          <MainTools roomId={roomId} />
          {/* <div className="main__controls__block">

                   

                  <div className="main__controls__button">
                      <i className="fas fa-shield-alt"></i>
                      <span>Security</span>
                  </div>
                  <div className="main__controls__button">
                      <i className="fas fa-user-friends"></i>
                      <span>Participants</span>
                  </div>
                  <div className="main__controls__button">
                      <i className="fas fa-comment-alt"></i>
                      <span>Chat</span>
                  </div>

                </div> */}
          <div className="main__controls__block">
            <div className="main__controls__button">
              <span className="leave_meeting">Leave Meeting</span>
            </div>
          </div>
        </div>
      </div>
      <div className="main__right">
        <div className="main__header">
          <h6>Chat</h6>
        </div>
        <div className="main__chat_window">
          <ul className="messages"></ul>
        </div>
        <div className="main__message_container">
          <input
            id="chat_message"
            type="text"
            onKeyDown={handleKeyPress}
            placeholder="Type message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Room;

//problems:
// Line 23:23:  Assignments to the 'myVideoStream' variable from inside React Hook
// useEffect will be lost after each render.
// To preserve the value over time, store it in a useRef Hook and keep the mutable value in the
// '.current' property. Otherwise, you can move this variable directly inside useEffect
// react-hooks/exhaustive-deps
