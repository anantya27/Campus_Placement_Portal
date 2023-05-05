import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const VideoCapture = () => {
  const videoRef = useRef(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    // Get access to the video stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Set the video source to the video element
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing video stream:', error);
      });

    // Clean up the video stream when the component unmounts
    return () => {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(captureAndSendFrame, 10000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  const captureAndSendFrame = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the captured frame to a data URL
    // const dataURL = canvas.toDataURL();
    const dataURL = canvas.toDataURL("image/jpeg", 1.0);
    // console.log(dataURL);

    // let image = new Image();
    // image.src = dataURL
    var file = dataURItoBlob(dataURL);
    console.log(file);
    //create fom data
    let formData = new FormData();
    formData.append("file", file);

    // Send the data URL to the POST API
    try {

      let res = await axios({
        method: "post",
        url: 'http://localhost:8000/predict ', //process.env.REACT_APP_API_URL,
        data: formData,
      });
      // setResponse(res.data);
      console.log(">>>>>>",res.data.class);
      // const response = await axios.post('/api/capture-frame', { frame: dataURL });
      setResponse(res.data.class);

      
    } catch (error) {
      console.error('Error sending frame to API:', error);
    }
  };

  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
    }


  // const sendFile = async () => {
  //   if (image) {
  //     let formData = new FormData();
  //     formData.append("file", selectedFile);
  //     let res = await axios({
  //       method: "post",
  //       url: 'http://localhost:8000/predict ', //process.env.REACT_APP_API_URL,
  //       data: formData,
  //     });
  //     if (res.status === 200) {
  //       setData(res.data);
  //     }
  //     setIsloading(false);
  //   }
  // }

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <div style={{color:'white'}}>{response}</div>
    </div>
  );
};

export default VideoCapture;