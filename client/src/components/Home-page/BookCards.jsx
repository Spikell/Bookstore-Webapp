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
      
      // Convert image URL to base64
      const imageBlob = await fetch(book.imageURL).then(r => r.blob());
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageBlob);
      });
      
      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = existingCart.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [
          ...existingCart,
          {
            id: book._id,
            bookTitle: book.bookTitle,
            price: price,
            quantity: 1,
            imageURL: base64Image,
            authorName: book.authorName || 'Unknown',
            category: book.category
          }
        ];
      }
      
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: updatedCart, userId: user.uid } }));
      
      toast.success('Book added to cart!', {
        position: 'bottom-center',
      });

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
      <h2 className="text-4xl text-center font-extrabold my-12 relative">
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
          className="mySwiper"
        >
          {books.map(book => (
            <SwiperSlide key={book._id}>
              <div 
                className="relative bg-white rounded-lg border-r-2 border-b-2 shadow-lg overflow-hidden cursor-pointer h-[480px] w-full flex flex-col"
                onClick={() => onBookSelect(book)}
              >
                <div className="h-[320px] w-full overflow-hidden">
                  <img src={book.imageURL} alt={book.bookTitle} className="w-full h-full object-contain" />
                </div>
                <button 
                  className={`cart-button absolute top-2 right-2 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition-all duration-300 ease-in-out transform ${recentlyAdded[book._id] ? 'scale-110' : ''}`}
                  onClick={(e) => addToCart(book, e)}
                >
                  {isInCart(book._id) ? (
                    <FaCheck className={`w-4 h-4 ${recentlyAdded[book._id] ? 'animate-bounce' : ''}`} />
                  ) : (
                    <FaShoppingCart className="w-4 h-4" />
                  )}
                </button>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 h-[56px]">{book.bookTitle}</h3>
                    <p className="text-sm text-gray-600 truncate">{book.authorName}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-bold text-green-600">${book.price}</p>
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
          .mySwiper {
            padding-bottom: 50px;
            position: relative;
          }
          .mySwiper .swiper-pagination {
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