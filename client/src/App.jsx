import { useState } from 'react'
import './App.css'
import { Outlet }  from 'react-router-dom'
import Navbar  from './components/Navbar'
import { NextUIProvider } from "@nextui-org/react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <NextUIProvider>
      <Navbar/>
      <Outlet/>
    </NextUIProvider>
  )
}

export default App