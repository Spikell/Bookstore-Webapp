import React, { useContext } from "react";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { AuthContext } from '../Firebase/AuthProvider';
import toast from 'react-hot-toast';

const SingleBook = ({ book, onClose, addToCart }) => {
  const { user } = useContext(AuthContext);

  const handleAddToCart = async () => {
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
    <div className="bg-white rounded-lg overflow-hidden p-0 flex flex-col md:flex-row" style={{ height: '60vh' }}>
      <div className="md:w-1/3 flex items-center justify-center bg-gray-100">
        <img
          src={book.imageURL}
          alt={book.bookTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:w-2/3 p-4 flex flex-col h-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        <div className="flex-grow flex flex-col overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{book.bookTitle}</h2>
          <p className="text-xl text-gray-600 mb-1">By {book.authorName}</p>
          <p className="text-lg text-blue-600 mb-4">{book.category}</p>
          <div className="flex-grow overflow-y-auto pr-4 mb-4 custom-scrollbar">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{book.description}</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-green-600">${parseFloat(book.price).toFixed(2)}</p>
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
              <button
                onClick={() => window.open(book.bookPDFURL, "_blank")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default SingleBook;
