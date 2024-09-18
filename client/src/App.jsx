import React, { useEffect } from 'react';
import axios from 'axios';
import CartDB from './Firebase/CartDB';
import './App.css'
import { Outlet }  from 'react-router-dom'
import Navbar  from './components/Navbar'
import { NextUIProvider } from "@nextui-org/react"
import { Toaster } from 'react-hot-toast';
import { app } from './Firebase/firebase.config';

function App() {
  console.log("Firebase app initialized:", app);

  useEffect(() => {
    const makeApiCall = async () => {
      try {
        const response = await axios.post("https://bookstore-webapp-api.vercel.app/");
        console.log("API response:", response.data);
      } catch (error) {
        console.error("Error making API call:", error);
      }
    };

    makeApiCall();
  }, []);

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