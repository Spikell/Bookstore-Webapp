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

          {/* Search results */}
          {showResults && books.length > 0 && (
            <div className="mt-8 flex flex-col space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Search Results
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {books.map((book) => (
                  <Card className="w-full max-w-[180px]" key={book._id}>
                    <Link
                      to={`/book/${book._id}`}
                      className="flex flex-col h-full"
                    >
                      <img
                        src={book.imageURL}
                        alt={book.bookTitle}
                        className="w-full h-[240px] object-contain"
                      />
                      <div className="flex flex-col p-3 flex-grow">
                        <h5 className="text-sm font-bold text-gray-900 line-clamp-2">
                          {book.bookTitle}
                        </h5>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          By {book.authorName}
                        </p>
                        <div className="mt-auto pt-2">
                          <span className="text-sm font-semibold text-blue-600">
                            ${book.price}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
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
