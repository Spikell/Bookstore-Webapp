import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBarsStaggered,
  FaBlog,
  FaXmark,
  FaChevronDown,
} from "react-icons/fa6";
import { FaShoppingCart, FaHome, FaInfoCircle, FaStore, FaSignOutAlt, FaSignInAlt, FaBook } from "react-icons/fa";
import { Flowbite, DarkThemeToggle, useThemeMode } from "flowbite-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { AuthContext } from "../Firebase/AuthProvider";
import { Toaster, toast } from "react-hot-toast";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { mode, toggleMode } = useThemeMode();

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    toast.dismiss();
    logout()
      .then(() => {
        console.log("Logged out");
        toast.success("Logged out successfully", { duration: 2000 });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        toast.error("Error logging out", { duration: 2000 });
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //nav items
  const navItems = [
    { link: "Home", path: "/", icon: <FaHome className="inline-block mr-1" /> },
    { link: "Shop", path: "/shop", icon: <FaStore className="inline-block mr-1" /> },
    { link: "Cart", path: "/cart", icon: <FaShoppingCart className="inline-block mr-1" /> },
    { link: "Sell your book", path: "/admin/dashboard", icon: <FaBook className="inline-block mr-1" /> },
    { link: "About", path: "/about", icon: <FaInfoCircle className="inline-block mr-1" /> },
  ];
  return (
    <header className="w-full bg-transparent fixed top-0 left-0 right-0 transition-all ease-in duration-300 z-50">
      <Toaster position="top-center" reverseOrder={false} />
      <nav
        className={`py-4 lg:px-24 px-4 ${
          isSticky ? "sticky top-0 left-0 right-0 bg-blue-300 shadow-md" : " "
        }`}
      >
        <div className="flex justify-between items-center text-base gap-8">
          {/* logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 flex items-center gap-2"
          >
            <FaBlog className="inline-block" />
            BookHaven
          </Link>

          {/* nav items for large devices */}
          <ul className="md:flex space-x-12 hidden">
            {navItems.map(({ link, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`block text-base uppercase cursor-pointer flex items-center
                   hover:text-blue-700 transition-colors duration-300
                   ${
                     location.pathname === path
                       ? "text-blue-700 font-semibold"
                       : "text-black"
                   }`}
              >
                {icon}
                {link}
              </Link>
            ))}
          </ul>

          {/* button for lg devices */}
          <div className="space-x-12 hidden lg:flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-black hover:text-blue-700 transition duration-300"
                >
                  {user.email}
                  <FaChevronDown className="ml-2 h-4 w-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition duration-200 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-black hover:text-blue-700 transition duration-300 flex items-center"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
            )}
          </div>

          {/* menu btn for mobile devices */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none"
            >
              {isMenuOpen ? (
                <FaXmark className="h-5 w-5 text-black" />
              ) : (
                <FaBarsStaggered className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* nav items for sm devices */}
        <div
          className={`space-y-4 px-4 mt-16 py-7 bg-blue-700 ${
            isMenuOpen ? "block fixed top-0 right-0 left-0" : "hidden"
          }`}
        >
          {navItems.map(({ link, path, icon }) => (
            <Link
              key={path}
              to={path}
              className="block text-base text-white uppercase cursor-pointer flex items-center"
            >
              {icon}
              {link}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="block text-base text-white uppercase cursor-pointer flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-base text-white uppercase cursor-pointer flex items-center"
            >
              <FaSignInAlt className="mr-2" /> Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
