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

const getNameFromEmail = (email) => {
  if (!email) return 'Guest';
  const [name] = email.split('@');
  const [firstName, lastName] = name.split('.');
  return `${firstName} ${lastName || ''}`.trim();
};

export const SideBar = () => {
  const { user } = useContext(AuthContext);
  console.log(user);

  const displayName = user?.displayName || getNameFromEmail(user?.email);

  return (
    <Sidebar className="border border-gray-300 sticky top-0">
      <div className="flex gap-4 mx-2 items-center">
        <Avatar
          size="sm"
          href="#"
          src={user?.photoURL}
          alt="User Profile"
          className="border-gray-300 rounded-full"
        />
        <h1 className="text-lg font-medium">
          {displayName}
        </h1>
      </div>

      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/admin/dashboard"
            icon={RxDashboard}
            className="hover:bg-cyan-200"
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/dashboard/upload"
            icon={TbBookUpload}
            className="hover:bg-cyan-200"
          >
            Upload Book
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/dashboard/manage"
            icon={HiInbox}
            className="hover:bg-cyan-200"
          >
            Manage Books
          </Sidebar.Item>
          <Sidebar.Item
            href="/"
            icon={AiOutlineHome}
            className="hover:bg-cyan-200"
          >
            Home
          </Sidebar.Item>
          <Sidebar.Item
            href="/logout"
            icon={RiLogoutBoxLine}
            className="hover:bg-cyan-200"
          >
            Log Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SideBar;
