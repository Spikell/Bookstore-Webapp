import React, { useState, useEffect, useContext } from "react";
import BannerCard from "./BannerCard";
import { AuthContext } from '../../Firebase/AuthProvider';
import toast from 'react-hot-toast';

const Banner = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/all-books`)
      .then((res) => res.json())
      .then((data) => setAllBooks(data));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  // search for books
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const filteredBooks = allBooks.filter(book =>
        book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredBooks);
      setShowResults(true);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const addToCart = async (book) => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === book._id);

    const price = typeof book.price === 'number' ? book.price : parseFloat(book.price) || 0;

    // Convert image URL to base64
    const imageBlob = await fetch(book.imageURL).then(r => r.blob());
    const base64Image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imageBlob);
    });

    if (existingItemIndex !== -1) {
      toast.success('Book is already in the cart!');
      return;
    } else {
      existingCart.push({
        id: book._id,
        bookTitle: book.bookTitle,
        price: price,
        quantity: 1,
        imageURL: base64Image,
        authorName: book.authorName || 'Unknown',
        category: book.category
      });
    }

    localStorage.setItem(`cart_${user.uid}`, JSON.stringify(existingCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: existingCart, userId: user.uid } }));

    toast.success('Book added to cart!');
  };

  return (
    <div className="px-4 lg:px-24 bg-teal-100 flex items-center">
      <div className="flex w-full flex-col md:flex-row justify-between items-center gap-12 py-40">
        {/* left side */}
        <div className="flex flex-col mb-12 md:w-1/2 space-y-8">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-[1.15] text-slate-900 tracking-tight">
            Buy and Sell Books{" "}
            <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400">
              for the Best Price
            </span>
          </h2>
          <p className="md:w-5/6 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            Discover a vast collection of books at unbeatable prices. Whether
            you're looking to buy or sell, our platform offers the best deals
            and a seamless experience.
          </p>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-5/6 pt-2 z-50">
            <div className="relative flex items-center w-full h-16 rounded-full bg-white overflow-hidden border-2 border-slate-200 focus-within:border-slate-300 hover:border-slate-300 transition-all duration-300">
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search for books by title or author..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="peer h-full w-full outline-none text-base text-slate-700 pl-6 pr-2 bg-transparent border-none focus:ring-0 placeholder-slate-400"
              />
              <button
                onClick={handleSearch}
                className="h-12 px-8 m-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Search
              </button>
            </div>

            {/* Search results popover */}
            {showResults && (
              <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-[60vh] overflow-hidden flex flex-col z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-600 flex items-center">
                    Search Results ({searchResults.length})
                  </h3>
                </div>
                
                <div className="overflow-y-auto p-2 custom-scrollbar">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col space-y-1">
                      {searchResults.map((book) => (
                        <div
                          key={book._id}
                          className="bg-white rounded-lg hover:bg-slate-50 transition-colors duration-150 flex flex-row items-center p-2 cursor-pointer group"
                          onClick={() => onBookSelect(book)}
                        >
                          <div className="w-12 h-16 overflow-hidden rounded flex-shrink-0 bg-slate-100 border border-slate-200">
                            <img
                              src={book.imageURL}
                              alt={book.bookTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-grow flex flex-col">
                            <h5 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {book.bookTitle}
                            </h5>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              By {book.authorName}
                            </p>
                            <div className="flex justify-between items-end mt-1">
                              <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {book.category}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                ${parseFloat(book.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-slate-500 text-sm font-medium">No books found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* right side */}
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
          <div className="drop-shadow-2xl">
            <BannerCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
