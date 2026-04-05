import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  FaBarsStaggered,
  FaBlog,
  FaXmark,
  FaChevronDown,
} from "react-icons/fa6";
import {
  FaShoppingCart,
  FaHome,
  FaInfoCircle,
  FaStore,
  FaSignOutAlt,
  FaSignInAlt,
  FaBook,
} from "react-icons/fa";
import { Flowbite, DarkThemeToggle, useThemeMode } from "flowbite-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { AuthContext } from "../Firebase/AuthProvider";
import { Toaster, toast } from "react-hot-toast";
import bookhavenLogo from "../assets/bookhaven-logo.svg";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { mode, toggleMode } = useThemeMode();
  const { user, logout, deleteAccount } = useContext(AuthContext);
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

  const confirmDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    toast.promise(
      deleteAccount(),
      {
        loading: 'Deleting your account and data...',
        success: () => {
          navigate("/");
          return 'Account deleted successfully';
        },
        error: (error) => {
          console.error("Error deleting account:", error);
          if (error?.code === 'auth/requires-recent-login') {
            logout().then(() => navigate('/login'));
            return 'Please log in again to delete your account.';
          }
          return 'Error deleting account. Please try again.';
        }
      },
      {
        success: { duration: 3000 },
        error: { duration: 4000 }
      }
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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

  useEffect(() => {
    if (user) {
      const loadCart = () => {
        const storedCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
        setCartItemsCount(storedCart.length);
      };
      
      const handleCartUpdate = (event) => {
        if (event.detail && event.detail.userId === user.uid) {
          setCartItemsCount(event.detail.cart.length);
        }
      };

      loadCart();
      window.addEventListener("cartUpdated", handleCartUpdate);
      return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    } else {
      setCartItemsCount(0);
    }
  }, [user]);

  const navItems = [
    { link: "Home", path: "/" },
    { link: "Shop", path: "/shop" },
    { link: "Dashboard", path: "/admin/dashboard" },
    { link: "About", path: "/about" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 ease-in-out z-50 ${isSticky ? "!bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3" : location.pathname === "/" ? "bg-teal-100 py-5" : "!bg-white py-5"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 flex items-center gap-2"
          >
            <img src={bookhavenLogo} alt="BookHaven Logo" className="h-10 w-10" />
            BookHaven
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center">
            <ul className={`flex items-center p-1.5 space-x-1 rounded-full transition-all duration-300 border-2 ${isSticky ? 'bg-white shadow-md border-slate-900/30' : 'bg-white shadow-lg shadow-slate-200/50 border-slate-900/30'}`}>
              {navItems.map(({ link, path }) => (
                <li key={link}>
                  <NavLink
                    to={path}
                    className={({ isActive }) => `relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden group ${isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <div className="absolute inset-0 bg-slate-900 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)]" />}
                        {!isActive && <div className="absolute inset-0 bg-slate-200/50 shadow-inner scale-0 rounded-full group-hover:scale-100 transition-transform duration-200 ease-out origin-center" />}
                        <span className="relative z-10 flex items-center gap-2">
                          <span>{link}</span>
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <FaShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow-sm translate-x-[2px] -translate-y-[2px] ring-2 ring-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white shadow-lg shadow-slate-200/50 border-2 border-slate-900/30 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm shadow-inner ring-2 ring-white/60">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <FaChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl z-50 overflow-hidden transform transition-all duration-300 origin-top-right ${dropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200 flex items-center gap-3"
                    >
                      <FaSignOutAlt className="text-slate-400" /> 
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
                    >
                      <FaXmark className="text-red-400" /> 
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out bg-slate-900 rounded-full hover:shadow-lg hover:shadow-slate-900/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  <FaSignInAlt className="text-white/90" /> 
                  Login
                </span>
              </Link>
            )}
            
          </div>
          
          <div className="lg:hidden flex items-center">
             <button
              onClick={toggleMenu}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/80 text-slate-700 hover:bg-slate-200 transition-colors duration-200 focus:outline-none"
            >
              {isMenuOpen ? <FaXmark className="h-5 w-5" /> : <FaBarsStaggered className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-4 flex flex-col space-y-2">
            {navItems.map(({ link, path }) => (
              <NavLink
                key={link}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-3 ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {({ isActive }) => (
                  <>
                    <span>{link}</span>
                  </>
                )}
              </NavLink>
            ))}
            
            <NavLink
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-3 ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              {({ isActive }) => (
                <>
                  <FaShoppingCart className={isActive ? "text-white" : "text-slate-400"} />
                  <span>Cart</span>
                  {cartItemsCount > 0 && (
                    <span className={`flex items-center justify-center min-w-[24px] h-[24px] px-2 rounded-full text-[12px] font-bold ml-auto shadow-sm transition-colors ${isActive ? 'bg-white text-slate-900' : 'bg-blue-600 text-white'}`}>
                      {cartItemsCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
            
            <div className="h-px w-full bg-slate-100 my-2" />
            
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="px-4 py-2">
                  <p className="text-xs text-slate-500 uppercase flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-slate-900 truncate pl-7">{user.email}</p>
                </div>
                <div className="flex flex-col gap-1 px-2 pb-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors duration-200 flex items-center gap-3"
                  >
                    <FaSignOutAlt className="text-slate-400" /> Logout
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <FaXmark className="text-red-400" /> Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors duration-200 flex items-center gap-3"
              >
                <FaSignInAlt className="text-slate-500" /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>

    {/* Delete Account Confirmation Modal */}
    {isDeleteModalOpen && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all scale-100 opacity-100 border border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mb-5 shadow-inner">
            <FaXmark className="text-red-500 h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">Delete Account?</h3>
          <p className="text-slate-500 text-center mb-8 text-sm leading-relaxed">
            Are you sure you want to completely delete your account and all associated profile data? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteAccount}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md shadow-red-500/30 active:scale-95 border border-red-600/20"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Navbar;
