import React, { useContext, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import toast from 'react-hot-toast'; // Import toast
import { AuthContext } from '../../Firebase/AuthProvider';

const BookCards = ({ headline, books, onBookSelect }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState({});

  useEffect(() => {
    if (user) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
      setCartItems(storedCart);
    }
  }, [user]);

  const addToCart = async (book, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    try {
      const existingCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
      const existingItemIndex = existingCart.findIndex(item => item.id === book._id);
      
      const price = typeof book.price === 'number' ? book.price : parseFloat(book.price) || 0;
      
      let updatedCart;
      if (existingItemIndex !== -1) {
        toast.success('Book is already in the cart!');
        return;
      } else {
        updatedCart = [
          ...existingCart,
          {
            id: book._id,
            bookTitle: book.bookTitle,
            price: price,
            quantity: 1,
            imageURL: book.imageURL,
            authorName: book.authorName || 'Unknown',
            category: book.category
          }
        ];
      }
      
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: updatedCart, userId: user.uid } }));
      
      toast.success('Book added to cart!');

      setCartItems(updatedCart);
      setRecentlyAdded(prev => ({ ...prev, [book._id]: true }));
      
      // Add a timeout to remove the bounce effect
      setTimeout(() => {
        setRecentlyAdded(prev => ({ ...prev, [book._id]: false }));
      }, 500);

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add book to cart. Please try again.');
    }
  };

  const isInCart = (bookId) => {
    return cartItems.some(item => item.id === bookId);
  };

  return (
    <div className="px-4 lg:px-24">
      <h2 className="text-4xl text-center font-extrabold mb-12 relative">
        <span className="bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">{headline}</span>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-700 to-purple-600 mx-auto mt-3"></div>
      </h2> 
      <div className="relative pb-2"> 
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            disabledClass: 'swiper-button-disabled',
            hiddenClass: 'swiper-button-hidden'
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination, Navigation]}
          className="bookCardsSwiper"
        >
          {books.map(book => (
            <SwiperSlide key={book._id}>
              <div 
                className="bg-white rounded-none overflow-hidden hover:ring-2 ring-blue-500/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl cursor-pointer group h-[480px] w-full"
                onClick={() => onBookSelect(book)}
              >
                <div className="h-[300px] w-full overflow-hidden relative shrink-0">
                  <img src={book.imageURL} alt={book.bookTitle} className="w-full h-full object-fill" />
                  
                  <button 
                    className={`cart-button absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all duration-300 z-10 ${isInCart(book._id) ? 'bg-green-500 text-white cursor-default hover:bg-green-600' : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white'} ${recentlyAdded[book._id] ? 'ring-4 ring-green-500/30' : ''}`}
                    onClick={(e) => addToCart(book, e)}
                  >
                    {isInCart(book._id) ? (
                      <FaCheck className={`w-4 h-4 ${recentlyAdded[book._id] ? 'animate-bounce' : ''}`} />
                    ) : (
                      <FaShoppingCart className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="p-4 flex flex-col flex-grow bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase truncate">
                      {book.category || 'Book'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-snug flex-grow group-hover:text-blue-700 transition-colors">
                    {book.bookTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 mb-3 text-sm text-gray-600">
                     <span className="font-semibold text-gray-800 truncate">
                       <span className="text-gray-400 font-normal mr-1">by</span>
                       {book.authorName || 'Unknown Author'}
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
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
      <style>
        {`
          .bookCardsSwiper {
            padding-top: 15px;
            padding-bottom: 50px;
            padding-left: 5px;
            padding-right: 5px;
            position: relative;
          }
          .bookCardsSwiper .swiper-pagination {
            bottom: 0 !important;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .swiper-button-next,
          .swiper-button-prev {
            color: #1d4ed8;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            cursor: pointer;
          }
          .swiper-button-prev {
            left: 10px;
          }
          .swiper-button-next {
            right: 10px;
          }
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 18px;
            font-weight: bold;
          }
          .swiper-button-disabled {
            opacity: 0;
            cursor: auto;
            pointer-events: none;
            visibility: hidden;
          }
          .swiper-button-hidden {
            opacity: 0;
            visibility: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default BookCards;