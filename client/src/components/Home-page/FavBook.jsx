import React from "react";
import favBook from "../../assets/favoritebook.jpg";
import { Link } from "react-router-dom";

const FavBook = () => {
  return (
    <div className="px-4 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-12">
      <div className="md:w-1/2">
        <img src={favBook} alt="favBook" className="rounded md:w-10/12" />
      </div>
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-5xl font-extrabold my-5 w-3/4 leading-snug relative">
          <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">Find your favorite</span>
          <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">books here</span>
        </h2>
        <p className="mb-10 text-lg md:w-5/6 !text-gray-800">
          Discover a wide range of books from various genres and authors. Whether you're looking for the latest bestsellers or timeless classics, we have something for every book lover.
        </p>
        {/* Flexbox for the stats */}
        <div className="flex flex-col md:flex-row justify-between gap-6 md:w-3/4 my-14">
          <div>
            <h3 className="text-3xl font-bold !text-gray-900">800+</h3>
            <p className="text-base !text-gray-500">Book Listing</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold !text-gray-900">550+</h3>
            <p className="text-base !text-gray-500">Registered Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold !text-gray-900">1200+</h3>
            <p className="text-base !text-gray-500">PDF Downloads</p>
          </div>
        </div>
        <Link to="/shop" className="block">
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-800 transition-all duration-300 mt-2">
            Explore More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FavBook;
