import React,{createContext,useState} from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './Component/Login'
import Home from './Component/Home/Home'
import Dragndrop from './Component/Dragndrop'
import Drag from './Component/Drag'
export const authContext=createContext();

const App = () => {
  
  const [token,setToken]=useState(null)

  console.log(token)
  return (
    <div>
      <authContext.Provider value={{token,setToken}}>
      <BrowserRouter  basename="/ex1v1">
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/dragndrop' element={<Dragndrop/>}/>
        <Route path='/drag' element={<Drag/>}/>
      </Routes>
      </BrowserRouter>
      </authContext.Provider>
    </div>
  )
}

export default App