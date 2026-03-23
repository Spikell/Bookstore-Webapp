import React, { useContext, useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import profile from "../assets/profile.jpg";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import { TbBookUpload } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { MdLogin } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { initFlowbite } from "flowbite";
import { AuthContext } from "../Firebase/AuthProvider";
import { AiOutlineHome } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBook, FaChartBar, FaUserCircle } from "react-icons/fa";

const getNameFromEmail = (email) => {
  if (!email) return "Guest";
  const [name] = email.split("@");
  const [firstName, lastName] = name.split(".");
  return `${firstName} ${lastName || ""}`.trim();
};

export const SideBar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout().then(() => {
      navigate("/");
    });
  };
  const [collapsed, setCollapsed] = useState(false);
  
  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const displayName = user?.displayName || getNameFromEmail(user?.email);

  // Toggle sidebar collapse on small screens
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-teal-500 text-white p-2 rounded-md shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <Sidebar 
        className={`border border-gray-300 shadow-lg transition-all duration-300 ease-in-out bg-white h-auto max-h-screen overflow-y-auto ${
          collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        } md:sticky md:top-0 fixed top-0 left-0 z-40 md:z-0 w-64`}
      >
        <div className="flex flex-col items-center py-6 px-4 border-b border-gray-200">
          <Avatar
            size="lg"
            src={user?.photoURL}
            alt="User Profile"
            className="border-2 border-teal-500 mb-3"
          />
          <h1 className="text-xl font-semibold text-gray-800">{displayName}</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
        </div>

        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/admin/dashboard">
              <Sidebar.Item
                icon={RxDashboard}
                className={`transition-colors duration-200 ${
                  isActive("/admin/dashboard") && !isActive("/admin/dashboard/upload") && !isActive("/admin/dashboard/manage") && !isActive("/admin/dashboard/edit-book")
                    ? "bg-teal-100 text-teal-800 font-medium border-l-4 border-teal-500"
                    : "hover:bg-teal-50 text-gray-700"
                }`}
              >
                Dashboard
              </Sidebar.Item>
            </Link>
            
            <Link to="/admin/dashboard/upload">
              <Sidebar.Item
                icon={TbBookUpload}
                className={`transition-colors duration-200 ${
                  isActive("/admin/dashboard/upload")
                    ? "bg-teal-100 text-teal-800 font-medium border-l-4 border-teal-500"
                    : "hover:bg-teal-50 text-gray-700"
                }`}
              >
                Upload Book
              </Sidebar.Item>
            </Link>
            
            <Link to="/admin/dashboard/manage">
              <Sidebar.Item
                icon={HiInbox}
                className={`transition-colors duration-200 ${
                  isActive("/admin/dashboard/manage") || isActive("/admin/dashboard/edit-book")
                    ? "bg-teal-100 text-teal-800 font-medium border-l-4 border-teal-500"
                    : "hover:bg-teal-50 text-gray-700"
                }`}
              >
                Manage Books
              </Sidebar.Item>
            </Link>
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Link to="/">
                <Sidebar.Item
                  icon={AiOutlineHome}
                  className="hover:bg-teal-50 text-gray-700 transition-colors duration-200"
                >
                  Home
                </Sidebar.Item>
              </Link>
              
              <button onClick={handleLogout} className="w-full text-left">
                <Sidebar.Item
                  icon={RiLogoutBoxLine}
                  className="hover:bg-red-50 text-red-600 transition-colors duration-200"
                >
                  Log Out
                </Sidebar.Item>
              </button>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        

      </Sidebar>
      
      {/* Overlay for mobile */}
      {!collapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default SideBar;
