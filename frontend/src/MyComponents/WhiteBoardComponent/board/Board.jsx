import React,{useEffect,useState} from 'react'

import './style.css'

function Board({socket}) {

  // const [time, setTime] = useState(undefined)
  const [canvasData, setCanvasData] = useState("");
  var canvas = document.querySelector('#board');

  // var timeout;

  useEffect(() => {
    
    drawOnCanvas();

    socket.on("canvas-data",function(data){
      // console.log("success");
      var image= new Image();
      var canvas = document.querySelector('#board');
      var ctx = canvas.getContext('2d');
      image.onload =function(){
        ctx.drawImage(image,0,0);
      }
      image.src=data;
    })

    
    // socket.on('testing',()=>{
      
    //   console.log("test done!!!!!!!!!!1")
    // }); 
  
  }, [socket])
  
  function handleClick() {
      // console.log("clicked");
      // socket.emit("test");
      var base64ImageData=canvas.toDataURL("image/png");
      setCanvasData(base64ImageData);
      socket.emit("canvas-data",canvasData);
  }


  function drawOnCanvas() {

    // var canvas = document.querySelector('#board');
    canvas = document.querySelector('#board');
    var ctx = canvas.getContext('2d');

    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);


    /* Drawing on Paint App */
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'blue';

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    
    // var timeout;
    // if(timeout!==undefined) clearTimeout(timeout);
    // // socket.emit("test");
    // // setTime( setTimeout(function(){
    // //   var base64ImageData=canvas.toDataUrl("image/png");
    // // },1000))
    // timeout=setTimeout(function(){
    //   var base64ImageData=canvas.toDataURL("image/png");
    //   socket.emit("canvas-data",base64ImageData);
    //   socket.emit("test");
    // },1000) 
    


    var onPaint = function() {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();
    };
    
  }


  return (
    <div  onClick={handleClick} className='sketch' id='sketch'>
      <canvas className='board' id='board'></canvas>
    </div>
  )
}

export default Board