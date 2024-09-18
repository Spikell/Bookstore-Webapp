import React, { useState, useEffect, useContext } from "react";
import BannerCard from "./BannerCard";
import { AuthContext } from '../../Firebase/AuthProvider';
import toast from 'react-hot-toast'; // Import toast

const Banner = ({ onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/all-books`)
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
      existingCart[existingItemIndex].quantity += 1;
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
    
    toast.success('Book added to cart!', {
      position: 'bottom-center',
    });
  };

  return (
    <div className="px-4 lg:px-24 bg-teal-100 flex items-center">
      <div className="flex w-full flex-col md:flex-row justify-between items-start gap-12 py-40">
        {/* left side */}
        <div className="flex flex-col mb-12  md:w-1/2 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-snug text-black">
            Buy and Sell Your Books{" "}
            <span className="text-blue-700">for the Best Price</span>
          </h2>
          <p className="md:w-4/5 text-lg text-gray-500">
            Discover a vast collection of books at unbeatable prices. Whether
            you're looking to buy or sell, our platform offers the best deals
            and a seamless experience. Join our community of book lovers today
            and find your next great read.
          </p>
          <div className="flex items-center">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search for books"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="py-2 px-4 bg-white rounded-l-sm outline-none focus:ring-1 focus:ring-blue-400 focus:ring-inset 
              focus:border-blue-400 border border-transparent focus:border-r-0 transition duration-300 ease-in-out placeholder-gray-400 text-gray-700"
            />
            <button
              onClick={handleSearch}
              className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-800 transition 
            duration-200 ease-in-out rounded-r-2xl border border-transparent focus:ring-1 focus:ring-blue-300 focus:border-blue-300 focus:border-l-0 -ml-px"
            >
              Search
            </button>
          </div>

          {/* Search results */}
          {showResults && (
            <div className="mt-8 flex flex-col space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Search Results ({searchResults.length})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {searchResults.map((book) => (
                  <div 
                    key={book._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    onClick={() => onBookSelect(book)}
                  >
                    <div className="h-48 overflow-hidden" onClick={() => onBookSelect(book)}>
                      <img
                        src={book.imageURL}
                        alt={book.bookTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex-grow flex flex-col justify-between">
                      <div onClick={() => onBookSelect(book)}>
                        <h5 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                          {book.bookTitle}
                        </h5>
                        <p className="text-xs text-gray-600 mb-1">
                          By {book.authorName}
                        </p>
                        <p className="text-xs text-blue-600 mb-1">{book.category}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-semibold text-green-600">
                          ${parseFloat(book.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* right side */}
        <div className="">
          <BannerCard />
        </div>
      </div>
    </div>
  );
};

export default Banner;
