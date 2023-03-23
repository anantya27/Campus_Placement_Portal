import React from 'react'
import Ide from './Tools/Ide'
import Profiles from './Tools/Profiles'
import WhiteBoard from './Tools/WhiteBoard'


function MainTools({roomId}) {
  return (
    <div className="main__controls__block">
        
        <WhiteBoard roomId={roomId}/>
        <Profiles roomId={roomId}/>
        <Ide roomId={roomId}/>

    </div>
  )
}

export default MainTools;