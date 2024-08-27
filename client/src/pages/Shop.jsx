import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { Card } from "flowbite-react";
import "../App.css";

const Shop = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);
  return (
    <div className="mt-24  py-4 lg:px-24">
      <h2 className="text-4xl font-bold text-center">All Books</h2>
      <div className=" grid gap-12 my-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-cols-1">
        {books.map((book) => (
          <Card className=" h-100 w-60 relative hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <img
              src={book.imageURL}
              className="w-full h-full object-full"
              alt={book.bookTitle}
            />
            <div className="flex flex-col items-left justify-center mx-4 mb-4">
              <h4 className="text-xl font-bold text-gray-800 mb-2 justify-center">
                {book.bookTitle}
              </h4>
              <p className="text-md text-blue-600 my-2">{book.category}</p>
              <p className="text-gray-600 mb-4 h-12 overflow-hidden truncate ...">
                {book.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">${book.price}</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                  Buy Now
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shop;
