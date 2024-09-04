import React from "react";
import { useLoaderData } from "react-router-dom";

const SingleBook = () => {
  const { bookTitle, imageURL, authorName, category, description, bookPDFURL, price } =
    useLoaderData();

  return (
    <div className="mt-28 px-4 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-300">
        <div className="md:flex max-h-[32rem]">
          <div className="md:w-1/3">
            <img
              className="w-full h-full object-cover"
              src={imageURL}
              alt={bookTitle}
            />
          </div>
          <div className="md:w-2/3 p-8 flex flex-col">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {bookTitle}
            </h2>
            <p className="text-xl text-gray-600 mb-2">By {authorName}</p>
            <p className="text-lg text-blue-600 mb-4">{category}</p>
            <div className="flex-grow overflow-y-auto mb-6 pr-4 custom-scrollbar">
              <p className="text-gray-700 leading-relaxed">{description}</p>
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
            <div className="flex items-end justify-end">
              {/* <p className="text-gray-600 mb-2">{price}</p> */}
              <button
                onClick={() => window.open(bookPDFURL, "_blank")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 hover:shadow-lg"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
