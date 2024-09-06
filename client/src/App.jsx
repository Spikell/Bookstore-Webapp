import { useState } from 'react'
import './App.css'
import { Outlet }  from 'react-router-dom'
import Navbar  from './components/Navbar'
import { NextUIProvider } from "@nextui-org/react"
import { Toaster } from 'react-hot-toast';

function App() {
  const [count, setCount] = useState(0)

  return (
    <NextUIProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 9999, // Increase this value if needed
          },
        }}
      />
      <Navbar/>
      <Outlet/>
    </NextUIProvider>
  )
}

export default App