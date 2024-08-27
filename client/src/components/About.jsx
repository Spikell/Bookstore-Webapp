import React from "react";
import { FaBook, FaRecycle, FaHandshake } from "react-icons/fa";

function About() {
  return (
    <div className="px-4 lg:px-24 py-12 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        About Our Bookstore
      </h2>
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-gray-700">
          Welcome to BookHaven, your go-to destination for literary treasures!
          Since 2010, we've been on a mission to ignite the passion for reading
          in book lovers across the globe.
        </p>
        <div className="flex items-center space-x-4">
          <FaBook className="text-blue-600" />
          <p className="text-gray-700">
            <span className="font-semibold">Our Mission:</span> To cultivate a
            vibrant community of readers by offering an extensive collection of
            books, fostering sustainability, and providing unparalleled customer
            service.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <FaRecycle className="text-green-600" />
          <p className="text-gray-700">
            <span className="font-semibold">Sustainability:</span> We're proud
            to offer a unique platform where book lovers can buy and sell gently
            used books, promoting eco-friendly reading habits.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <FaHandshake className="text-orange-600" />
          <p className="text-gray-700">
            <span className="font-semibold">Our Promise:</span> Whether you're
            seeking bestsellers, timeless classics, or niche topics, we're
            committed to helping you find your next literary adventure at
            competitive prices.
          </p>
        </div>
        <blockquote className="italic text-gray-600 border-l-4 border-blue-500 pl-4">
          "BookHaven has transformed my reading experience. Their selection is
          unmatched, and the ability to sell my old books is fantastic!" - Sarah
          T., Loyal Customer
        </blockquote>
        <div className="text-center mt-10">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-black transition duration-300 mt-4">
            Explore Our Collection
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-center">
          Book Quote of the Day
        </h3>
        <p className="text-center text-gray-700 italic">
          "A room without books is like a body without a soul." - Marcus Tullius
          Cicero
        </p>
      </div>
    </div>
  );
}

export default About;
