import React from "react";
import { FaBook, FaRecycle, FaHandshake, FaQuoteLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="mt-24 py-4 lg:px-24 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">
        About Our Bookstore
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed mb-10">
        Welcome to BookHaven, your go-to destination for literary treasures!
        Since 2010, we've been on a mission to ignite the passion for reading in
        book lovers across the globe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: FaBook,
            title: "Our Mission",
            color: "blue",
            description:
              "Cultivating a vibrant community of readers with extensive collections and unparalleled service.",
          },
          {
            icon: FaRecycle,
            title: "Sustainability",
            color: "green",
            description:
              "Promoting eco-friendly reading habits through our buy-and-sell platform for gently used books.",
          },
          {
            icon: FaHandshake,
            title: "Our Promise",
            color: "orange",
            description:
              "Committed to helping you find your next literary adventure at competitive prices.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-4 transition-all duration-200 shadow-md flex flex-col items-center text-center`}
          >
            <item.icon className={`text-${item.color}-600 text-4xl mb-3`} />
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-700 text-sm">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 shadow-md relative mb-10">
        <FaQuoteLeft className="text-blue-200 text-4xl absolute top-4 left-4" />
        <blockquote className="italic text-gray-600 pl-8 pt-4">
          "BookHaven has transformed my reading experience. Their selection is
          unmatched, and the ability to sell my old books is fantastic!"
        </blockquote>
        <p className="text-right mt-4 text-gray-500">
          - Sarah T., Loyal Customer
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 transition-all duration-200 shadow-md mb-10">
        <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Book Quote of the Day
        </h3>
        <p className="text-center text-gray-700 italic">
          "A room without books is like a body without a soul."
        </p>
        <p className="text-right mt-2 text-gray-500">- Marcus Tullius Cicero</p>
      </div>

      <div className="text-center">
        <Link to="/shop" className="inline-block">
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform shadow-md hover:shadow-lg">
            Explore Our Collection
          </button>
        </Link>
      </div>
    </div>
  );
}

export default About;
