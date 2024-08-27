import React, { useState, useEffect } from "react";
import BannerCard from "./BannerCard";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setShowResults(false);
    }
  };

  // search for books
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      fetch(
        `http://localhost:5000/all-books?bookTitle=${encodeURIComponent(
          searchQuery
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBooks(data);
          setShowResults(true);
          if (data.length > 0) {
            setSelectedBook(data[0]);
          }
        });
    } else {
      setShowResults(false);
      setSelectedBook(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
          {showResults && selectedBook && (
            <div className="mt-8 flex flex-col">
              <Card className="w-96 h-64 flex flex-row" key={selectedBook._id}>
                <Link
                  to={`/book/${selectedBook._id}`}
                  className="flex flex-row w-full h-full"
                >
                  <div className="flex items-center justify-center w-2/5 h-full">
                    <img
                      src={selectedBook.imageURL}
                      alt={selectedBook.bookTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col  w-3/5 h-full px-4 py-1 overflow-hidden">
                    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
                      {selectedBook.bookTitle}
                    </h5>
                    <p className="flex flex-col text-md font-normal text-gray-800 dark:text-gray-400 mt-1">
                      By {selectedBook.authorName}
                      <span className="text-gray-600 mt-1">
                        {selectedBook.category}
                      </span>
                    </p>
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex-grow mt-2 text-gray-600 overflow-hidden">
                        <p className="line-clamp-5 text-sm">
                          {selectedBook.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-blue-600">
                          ${selectedBook.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
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
