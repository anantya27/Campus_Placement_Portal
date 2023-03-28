import React from 'react'
import Board from '../board/Board'
import './style.css';

function Container({socket}) {
  return (
    <div className='container'>
        <div className='color-picker-container'>
            <input type="color"/>
        </div>
        <div className='board-container'>
            <Board socket={socket}/>
        </div>
        
    </div>
  )
}

export default Container