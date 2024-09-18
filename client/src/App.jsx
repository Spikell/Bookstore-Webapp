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
        console.log("Attempting to call API at:", `${import.meta.env.VITE_API_URL}/all-books`);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-books`);
        console.log("API response:", response.data);
      } catch (error) {
        console.error("Error making API call:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
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