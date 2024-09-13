import React from 'react';
import CartDB from './Firebase/CartDB';
import './App.css'
import { Outlet }  from 'react-router-dom'
import Navbar  from './components/Navbar'
import { NextUIProvider } from "@nextui-org/react"
import { Toaster } from 'react-hot-toast';
import { app } from './Firebase/firebase.config'; // Import the Firebase app

function App() {
  console.log("Firebase app initialized:", app);

  return (
    <>
      <CartDB />
      <NextUIProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
        <Navbar/>
        <Outlet/>
      </NextUIProvider>
    </>
  );
}

export default App;