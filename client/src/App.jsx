import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import Search from './Search'
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Login />}></Route>
      <Route path='/register' element={<Signup />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/search' element={<Search />}></Route>
    </Routes>
     </BrowserRouter>
  )
}

export default App
