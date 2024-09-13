import React from "react";
import { FaTimes, FaShoppingCart } from "react-icons/fa";

const SingleBook = ({ book, onClose, addToCart }) => {
  const { bookTitle, imageURL, authorName, category, description, bookPDFURL, price } = book;

  return (
    <div className="bg-white rounded-lg overflow-hidden p-0 flex flex-col md:flex-row" style={{ height: '60vh' }}>
      <div className="md:w-1/3 flex items-center justify-center">
        <img
          src={imageURL}
          alt={bookTitle}
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{bookTitle}</h2>
          <p className="text-xl text-gray-600 mb-1">By {authorName}</p>
          <p className="text-lg text-blue-600 mb-4">{category}</p>
          <div className="flex-grow overflow-y-auto pr-4 mb-4 custom-scrollbar">
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-green-600">${parseFloat(price).toFixed(2)}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => addToCart(book)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
              <button
                onClick={() => window.open(bookPDFURL, "_blank")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
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
