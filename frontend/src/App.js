import React from 'react'
import "./App.css"
import { Route, Routes } from 'react-router-dom';
import {v4 as uuid} from "uuid";

import Home from "./MyComponents/Home";
import Room from "./MyComponents/Room";

function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={ <Home uuid={uuid} /> }></Route>
        <Route path="/:roomId" element={ <Room/> }></Route>
      </Routes>

    </>
   
  )
}

export default App;


