import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
import "../App.css";
import { ImSearch } from "react-icons/im";
import { bookCategories } from "../data";
import { FaShoppingCart, FaCheck, FaSortAlphaDown, FaDollarSign, FaFilter, FaChevronDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../Firebase/AuthProvider';
import SingleBook from '../components/SingleBook';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortConfig, setSortConfig] = useState({
    field: 'price',
    direction: 'asc',
  });
  const [showFilters, setShowFilters] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeoutRef = useRef(null);

  const pendingUpdatesRef = useRef([]);
  const updateTimeoutRef = useRef(null);
  const BATCH_INTERVAL = 1000;

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
      if (user) {
        localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: updatedCart, userId: user.uid } }));
      }
      pendingUpdatesRef.current = [];
    }
  }, [cartItems, user]);

  const queueUpdate = useCallback((itemId, changes) => {
    pendingUpdatesRef.current.push({ id: itemId, ...changes });

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

    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(processPendingUpdates, BATCH_INTERVAL);
  }, [processPendingUpdates]);

  useEffect(() => {
    const loadCart = () => {
      if (user) {
        const storedCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
        setCartItems(storedCart);
      }
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

      const newItem = {
        id: book._id,
        bookTitle: book.bookTitle,
        price: price,
        quantity: 1,
        imageURL: book.imageURL,
        authorName: book.authorName || 'Unknown',
        category: book.category
      };

      const existingCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
      if (existingCart.some(item => item.id === book._id)) {
        toast.success('Book is already in the cart!');
        return;
      }

      queueUpdate(book._id, newItem);

      toast.success('Book added to cart!');

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
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/all-books`)
      .then((res) => res.json())
      .then((data) => {
        const booksWithAuthor = data.map(book => ({
          ...book,
          authorName: book.authorName || 'Unknown'
        }));
        setBooks(booksWithAuthor);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm.trim() !== '' && !searchHistory.includes(searchTerm.trim())) {
        setSearchHistory(prev => [searchTerm.trim(), ...prev].slice(0, 5));
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, searchHistory]);

  const handleSort = (field) => {
    setSortConfig(prev => {
      if (prev.field === field) {
        return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { ...prev, field, direction: 'asc' };
    });
  };

  const sortedAndFilteredBooks = useMemo(() => {
    let result = books;

    if (debouncedSearchTerm) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      result = result.filter(book =>
        (book.bookTitle && book.bookTitle.toLowerCase().includes(lowerSearch)) ||
        (book.authorName && book.authorName.toLowerCase().includes(lowerSearch)) ||
        (book.category && book.category.toLowerCase().includes(lowerSearch))
      );
    }

    if (author) {
      result = result.filter(book => book.authorName && book.authorName.toLowerCase().includes(author.toLowerCase()));
    }

    if (category) {
      result = result.filter(book => book.category && book.category.toLowerCase() === category.toLowerCase());
    }

    if (minPrice !== '') {
      result = result.filter(book => Number(book.price) >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(book => Number(book.price) <= Number(maxPrice));
    }

    const sorted = [...result].sort((a, b) => {
      let comparison = 0;
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (sortConfig.field === 'price') {
        const valueA = typeof aValue === 'number' ? aValue : parseFloat(aValue) || 0;
        const valueB = typeof bValue === 'number' ? bValue : parseFloat(bValue) || 0;
        comparison = valueA - valueB;
      } else if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = (aValue || 0) - (bValue || 0);
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }, [books, debouncedSearchTerm, author, category, minPrice, maxPrice, sortConfig]);

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
    if (!event.target.closest('.cart-button')) {
      openBookModal(book);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const BookCardSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-none overflow-hidden flex flex-col shadow-sm">
      <div className="relative aspect-[4/5] bg-gray-100">
        <Skeleton height="100%" />
      </div>
      <div className="p-3">
        <Skeleton width="40%" height={12} className="mb-2" />
        <Skeleton width="90%" height={18} className="mb-1" />
        <Skeleton width="60%" height={14} className="mb-3" />
        <Skeleton width={80} height={20} />
      </div>
    </div>
  );

  return (
    <div className="mt-20 py-8 px-4 lg:px-8 max-w-[1600px] mx-auto bg-gray-50/30 min-h-screen">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      
      {/* Header migrated to right column so it animates fully */}

      <div className="flex flex-col md:flex-row items-start relative w-full">
        
        {/* Left Sidebar - Filters Wrapper with Animation */}
        <div 
          className={`shrink-0 transition-all duration-500 ease-in-out overflow-hidden origin-left ${
            showFilters 
              ? 'w-full md:w-64 opacity-100 max-h-[2000px] md:max-h-none md:mr-8 mb-6 md:mb-0' 
              : 'w-full md:w-0 opacity-0 max-h-0 md:max-h-none m-0'
          }`}
        >
          <div className="w-full md:w-64 flex flex-col gap-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto modern-scrollbar bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h3 className="text-xl font-extrabold text-gray-900">Filters</h3>
            <button
              onClick={() => {
                setSearchTerm('');
                setAuthor('');
                setCategory('');
                setCategorySearchTerm('');
                setMinPrice('');
                setMaxPrice('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-bold tracking-wide"
            >
              Reset All
            </button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 uppercase tracking-widest">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-base text-gray-900 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <ImSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 uppercase tracking-widest">Author</label>
            <input
                type="text"
                placeholder="Author name..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 text-base text-gray-900 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
          </div>

          {/* Category Combobox */}
          <div className="space-y-2 relative" ref={categoryDropdownRef}>
            <label className="text-sm font-bold text-gray-800 uppercase tracking-widest">Category</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Select or search..."
                value={categorySearchTerm}
                onChange={(e) => {
                  setCategorySearchTerm(e.target.value);
                  setIsCategoryDropdownOpen(true);
                  if (e.target.value === '') {
                    setCategory('');
                  }
                }}
                onFocus={() => setIsCategoryDropdownOpen(true)}
                className="w-full pl-4 pr-10 py-3 text-base text-gray-900 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-shadow cursor-text"
              />
              <FaChevronDown 
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 cursor-pointer ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} 
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              />
            </div>
            
            {isCategoryDropdownOpen && (
              <div className="absolute z-30 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-2xl ring-1 ring-black/5 p-2 flex flex-col gap-1 max-h-64 overflow-y-auto modern-scrollbar">
                <div
                  className={`text-base cursor-pointer py-2 px-3 rounded-lg transition-colors ${category === '' && categorySearchTerm === '' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                  onClick={() => { 
                    setCategory(''); 
                    setCategorySearchTerm('');
                    setIsCategoryDropdownOpen(false); 
                  }}
                >
                  All Categories
                </div>
                {bookCategories
                  .filter(cat => cat.label.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                  .map(cat => (
                    <div
                      key={cat.value}
                      className={`text-base cursor-pointer py-2 px-3 rounded-lg transition-colors ${category === cat.label ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}
                      onClick={() => { 
                        setCategory(cat.label); 
                        setCategorySearchTerm(cat.label);
                        setIsCategoryDropdownOpen(false); 
                      }}
                    >
                      {cat.label}
                    </div>
                  ))}
                {bookCategories.filter(cat => cat.label.toLowerCase().includes(categorySearchTerm.toLowerCase())).length === 0 && (
                  <div className="py-3 px-3 text-base text-gray-500 text-center font-medium">No categories found</div>
                )}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 uppercase tracking-widest">Price Range</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={minPrice} 
                onChange={e => setMinPrice(e.target.value)} 
                placeholder="Min" 
                min="0"
                className="w-full p-3 text-base text-gray-900 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 [color-scheme:light]" 
              />
              <span className="text-gray-400 font-bold">-</span>
              <input 
                type="number" 
                value={maxPrice} 
                onChange={e => setMaxPrice(e.target.value)} 
                placeholder="Max" 
                min="0"
                className="w-full p-3 text-base text-gray-900 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 [color-scheme:light]" 
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <label className="text-sm font-bold text-gray-800 uppercase tracking-widest">Sort By</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSort('bookTitle')}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-xl border transition-colors ${sortConfig.field === 'bookTitle' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <FaSortAlphaDown className={sortConfig.field === 'bookTitle' ? 'text-blue-500' : 'text-gray-400'} />
                  Title
                </div>
                {sortConfig.field === 'bookTitle' && <span className="text-xs font-medium">{sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'}</span>}
              </button>
              
              <button
                onClick={() => handleSort('price')}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-xl border transition-colors ${sortConfig.field === 'price' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <FaDollarSign className={sortConfig.field === 'price' ? 'text-green-500' : 'text-gray-400'} />
                  Price
                </div>
                {sortConfig.field === 'price' && <span className="text-xs font-medium">{sortConfig.direction === 'asc' ? 'Low-High' : 'High-Low'}</span>}
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Right Content - Book Grid */}
        <div className="flex-1 min-w-0 transition-all duration-500">
          
          {/* Universal Page Header & Filter Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Explore Books</h2>
              <p className="text-sm text-gray-500 mt-2">Showing {sortedAndFilteredBooks.length} results based on your current filters</p>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-300 ${
                showFilters 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <FaFilter className={`transition-transform duration-500 ${!showFilters ? 'text-gray-500' : 'text-blue-600'}`} /> 
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {sortedAndFilteredBooks.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800">No books found</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">Try adjusting your filters or searching with different keywords.</p>
              <button onClick={() => { setSearchTerm(''); setAuthor(''); setCategory(''); setCategorySearchTerm(''); setMinPrice(''); setMaxPrice(''); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {isLoading
                ? Array(10).fill().map((_, index) => <BookCardSkeleton key={index} />)
                : sortedAndFilteredBooks.map((book) => (
                  <div key={book._id} className="bg-white rounded-none overflow-hidden hover:ring-2 ring-blue-500/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl cursor-pointer group" onClick={(e) => handleBookClick(book, e)}>
                    <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={book.imageURL}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        alt={book.bookTitle}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <button
                        className={`cart-button absolute bottom-3 right-3 bg-white text-blue-600 hover:bg-blue-600 hover:text-white p-2.5 rounded-full shadow-lg transition-all duration-300 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${addedToCart[book._id] ? 'bg-green-500 text-white translate-y-0 opacity-100' : ''}`}
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
                    <div className="p-4 flex flex-col flex-grow bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase truncate">
                          {book.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-snug flex-grow group-hover:text-blue-700 transition-colors">
                        {book.bookTitle}
                      </h4>
                      <div className="flex items-center gap-1.5 mb-3 text-sm text-gray-600">
                         <span className="font-semibold text-gray-800 truncate">
                           <span className="text-gray-400 font-normal mr-1">by</span>
                           {book.author || book.authorName || 'Unknown Author'}
                         </span>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-medium mb-0.5">Price</span>
                          <span className="text-xl font-black text-green-700">
                            ${typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price).toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* SingleBook Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeBookModal}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <SingleBook book={selectedBook} onClose={closeBookModal} addToCart={addToCart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
