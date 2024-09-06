import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBarsStaggered,
  FaBlog,
  FaXmark,
  FaChevronDown,
} from "react-icons/fa6"; // Added FaChevronDown
import { Flowbite, DarkThemeToggle, useThemeMode } from "flowbite-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { AuthContext } from "../Firebase/AuthProvider";
import { Toaster, toast } from "react-hot-toast"; // Add this import

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Add this line
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
    toast.dismiss(); // Dismiss any existing toasts
    logout()
      .then(() => {
        console.log("Logged out");
        toast.success("Logged out successfully", { duration: 2000 });
        setTimeout(() => {
          navigate("/");
        }, 2000); // Delay navigation by 1 second
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
    { link: "Home", path: "/" },
    { link: "Shop", path: "/shop" },
    { link: "Cart", path: "/cart" },
    { link: "Sell your book", path: "/admin/dashboard" },
    { link: "About", path: "/about" },
    // { link: <DarkThemeToggle />, path: "" },
  ];
  return (
    <header className="w-full bg-transparent fixed top-0 left-0 right-0 transition-all ease-in duration-300">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Add this line */}
      <nav
        className={`py-4 lg:px-24 px-4 ${
          isSticky ? "sticky top-0 left-0 right-0 bg-blue-300" : " "
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
            {navItems.map(({ link, path }) => (
              <Link
                key={path}
                to={path}
                className={`block text-base text-black uppercase cursor-pointer
                   hover:text-blue-700 
                   ${
                     location.pathname === path
                       ? "text-blue-500 font-normal"
                       : "text-black"
                   }`}
              >
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
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-black hover:text-blue-700 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* menu btn for mobile devices */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-black focus: outline-none"
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
          {navItems.map(({ link, path }) => (
            <Link
              key={path}
              to={path}
              className="block text-base text-white uppercase cursor-pointer"
            >
              {link}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
