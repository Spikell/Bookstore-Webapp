import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card } from "flowbite-react";
import "../App.css";
import { ImSearch } from "react-icons/im";
import { VscSettings } from "react-icons/vsc";
import { bookCategories } from "../data"; 
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { FaShoppingCart, FaCheck } from "react-icons/fa"; // Add FaCheck import
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast
import { AuthContext } from '../Firebase/AuthProvider';
import { useContext } from 'react';
import SingleBook from '../components/SingleBook';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext); // Get the current user from AuthContext
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const pendingUpdatesRef = useRef([]);
  const updateTimeoutRef = useRef(null);
  const BATCH_INTERVAL = 1000; // 1 second interval for batching updates

  const processPendingUpdates = useCallback(() => {
    if (pendingUpdatesRef.current.length > 0) {
      const updatedCart = pendingUpdatesRef.current.reduce((acc, update) => {
        const existingItemIndex = acc.findIndex(item => item.id === update.id);
        if (existingItemIndex !== -1) {
          acc[existingItemIndex] = { ...acc[existingItemIndex], ...update };
        } else {
          acc.push(update);
        }
        return acc;
      }, [...cartItems]);

      setCartItems(updatedCart);
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: updatedCart, userId: user.uid } }));
      pendingUpdatesRef.current = [];
    }
  }, [cartItems, user]);

  const queueUpdate = useCallback((itemId, changes) => {
    pendingUpdatesRef.current.push({ id: itemId, ...changes });
    
    // Update local state immediately
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === itemId);
      if (existingItemIndex !== -1) {
        return prevItems.map(item => 
          item.id === itemId ? { ...item, ...changes } : item
        );
      } else {
        return [...prevItems, changes];
      }
    });

    // Clear existing timeout and set a new one
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(processPendingUpdates, BATCH_INTERVAL);
  }, [processPendingUpdates]);

  useEffect(() => {
    const loadCart = () => {
      if (user) {
        const storedCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
        setCartItems(storedCart);
      }
      setIsLoading(false);
    };

    loadCart();
    window.addEventListener('storage', loadCart);

    return () => window.removeEventListener('storage', loadCart);
  }, [user]);

  const addToCart = async (book) => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    try {
      const price = typeof book.price === 'number' ? book.price : parseFloat(book.price) || 0;
      
      // Convert image URL to base64
      const imageBlob = await fetch(book.imageURL).then(r => r.blob());
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageBlob);
      });
      
      const newItem = {
        id: book._id,
        bookTitle: book.bookTitle,
        price: price,
        quantity: 1,
        imageURL: base64Image,
        authorName: book.authorName || 'Unknown',
        category: book.category
      };

      queueUpdate(book._id, newItem);
      
      toast.success('Book added to cart!', {
        position: 'bottom-center',
      });

      setAddedToCart(prev => ({ ...prev, [book._id]: true }));

      setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [book._id]: false }));
      }, 500);

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add book to cart. Please try again.');
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/all-books` || "http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => {
        // Ensure each book has an authorName property
        const booksWithAuthor = data.map(book => ({
          ...book, 
          authorName: book.authorName || 'Unknown'
        }));
        setBooks(booksWithAuthor);
        setFilteredBooks(booksWithAuthor);
      });
  }, []);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setShowCategoryDropdown(true);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory.label);
    setShowCategoryDropdown(false);
  };

  const filteredCategories = useMemo(() => {
    if (!category) return bookCategories;
    return bookCategories.filter((cat) =>
      cat.label.toLowerCase().includes((category || '').toLowerCase())
    );
  }, [category]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAdvancedSearch = () => {
    const filtered = books.filter((book) => {
      const matchesSearch = searchTerm === '' || 
        book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAuthor = author === '' || book.authorName.toLowerCase().includes(author.toLowerCase());
      const matchesCategory = category === '' || book.category.toLowerCase() === category.toLowerCase();
      const matchesPrice = (minPrice === '' || book.price >= Number(minPrice)) &&
                           (maxPrice === '' || book.price <= Number(maxPrice));

      return matchesSearch && matchesAuthor && matchesCategory && matchesPrice;
    });
    setFilteredBooks(filtered);
    setShowAdvancedSearch(false);

    // Log the results for debugging
    console.log('Filtered books:', filtered);
    console.log('Search criteria:', { searchTerm, author, category, minPrice, maxPrice });
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedBooks = useMemo(() => {
    console.log('Sorting books:', filteredBooks.length);
    return [...filteredBooks].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }, [filteredBooks, sortOrder, searchTerm, author, category, minPrice, maxPrice]);

  const isInCart = (bookId) => {
    return cartItems.some(item => item.id === bookId);
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
  };

  const handleBookClick = (book, event) => {
    // Check if the click target is the cart button or its child elements
    if (!event.target.closest('.cart-button')) {
      openBookModal(book);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <div className="mt-24 py-4 lg:px-24">
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <h2 className="text-4xl font-bold text-center">All Books</h2>
      {/* Search control */}
      <div className="my-6 relative w-1/3 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl  focus:ring-0 focus:ring-blue-400 focus:border-blue-400 duration-200"
          />
          <ImSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <VscSettings
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer transition-transform duration-300 size-5 ${showAdvancedSearch ? 'rotate-180' : ''}`}
            onClick={toggleAdvancedSearch}
          />
        </div>
        
        <div className={`mt-4 bg-white border rounded-md shadow-md overflow-hidden transition-all duration-300 ease-in-out ${showAdvancedSearch ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold mb-2">Advanced Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="relative" ref={categoryDropdownRef}>
                <input
                  type="text"
                  placeholder="Select Category"
                  value={category}
                  onChange={handleCategoryChange}
                  onFocus={() => setShowCategoryDropdown(true)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {showCategoryDropdown && (
                  <ul className="modern-scrollbar absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCategories.map((cat) => (
                      <li
                        key={cat.value}
                        onClick={() => handleCategorySelect(cat)}
                        className="px-4 py-2 hover:bg-teal-50 cursor-pointer transition-colors duration-150"
                      >
                        {cat.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                  min="0"
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                  min="0"
                  placeholder="Max"
                />
              </div>
            </div>
            <button
              onClick={handleAdvancedSearch}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform  shadow-md hover:shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sort button */}
      <div className="flex justify-end my-4">
        <button
          onClick={toggleSortOrder}
          className="flex items-center bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          Sort by Price
          {sortOrder === 'asc' ? (
            <HiSortAscending className="ml-2" />
          ) : (
            <HiSortDescending className="ml-2" />
          )}
        </button>
      </div>

      {/* Updated Book grid with no white spaces around book cover */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 my-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-cols-1">
          {sortedBooks.map((book) => (
            <div key={book._id} className="bg-white border-3 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-all duration-200 flex flex-col shadow-lg hover:shadow-xl cursor-pointer" onClick={(e) => handleBookClick(book, e)}>
              <div className="relative aspect-[2/3] bg-gray-100">
                <img
                  src={book.imageURL}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={book.bookTitle}
                />
                <button 
                  className={`cart-button absolute top-2 right-2 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition-all duration-300 ease-in-out transform ${addedToCart[book._id] ? 'scale-110' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(book);
                  }}
                >
                  {isInCart(book._id) ? (
                    <FaCheck className={`w-4 h-4 ${addedToCart[book._id] ? 'animate-bounce' : ''}`} />
                  ) : (
                    <FaShoppingCart className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
                <h4 className="text-base font-semibold text-gray-800 mb-1 truncate">
                  {book.bookTitle}
                </h4>
                <p className="text-sm text-gray-600 mb-1 truncate">
                  {book.author || book.authorName || 'Unknown'}
                </p>
                <p className="text-sm text-blue-600 mb-2">{book.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-green-600">
                    ${typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price).toFixed(2) || '0.00'}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1.5 px-3 rounded transition duration-200 ease-in-out">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SingleBook Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeBookModal}>
          <div className="bg-white rounded-lg w-11/12 max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <SingleBook book={selectedBook} onClose={closeBookModal} addToCart={addToCart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
