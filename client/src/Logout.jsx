import React, { useContext } from "react";
import { AuthContext } from "./Firebase/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast'; // Add this import

const Logout = () => {

  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  const handleLogout = () => {
    logout().then(() => {
      console.log("Logged out");
      toast.success("Logged out successfully", { duration: 2000 }); // Increase duration
      navigate(from, { replace: true });
    }).catch((error) => {
      console.error("Error logging out:", error);
      toast.error("Error logging out", { duration: 2000 }); // Increase duration
    });
  };

  return (
    <div className="h-screen bg-teal-100 flex flex-col items-center justify-center">
      <div>
        <p className="text-gray-500">Are you sure you want to logout?</p>
      </div>
      <div className="mt-4 text-xl font-bold">
        <button
          onClick={handleLogout}
          className="rounded-lg shadow-lg  bg-teal-500 text-white px-4 py-2 
          hover:bg-teal-600 transition duration-300"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Logout;
