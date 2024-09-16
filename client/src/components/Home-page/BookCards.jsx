import React, { useContext, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
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
    <div className="my-12 px-4 lg:px-24">
      <h2 className="text-4xl text-center font-bold text-black my-12">
        {headline}
      </h2>
      <div className="relative pb-2"> {/* Added relative positioning and padding */}
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
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
          modules={[Pagination]}
          className="mySwiper"
        >
          {books.map(book => (
            <SwiperSlide key={book._id}>
              <div 
                className="relative bg-white rounded-lg border-r-2 border-b-2 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => onBookSelect(book)}
              >
                <img src={book.imageURL} alt="" className="w-full h-90 object-cover" /> {/* Increased height to 80 */}
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
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{book.bookTitle}</h3>
                  <p className="text-sm text-gray-600">{book.authorName}</p>
                  <div className="mt-2">
                    <p className="text-lg font-bold text-green-600">${book.price}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style>
        {`
          .mySwiper {
            padding-bottom: 30px;
          }
          .mySwiper .swiper-pagination {
            bottom: 0 !important;
          }
        `}
      </style>
    </div>
  );
};

export default BookCards;