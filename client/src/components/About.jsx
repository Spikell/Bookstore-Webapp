import React from "react";
import { FaBook, FaRecycle, FaHandshake, FaQuoteLeft, FaInfoCircle, FaUsers, FaHistory, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="bg-white min-h-screen w-full pt-28 pb-8">
      <div className="px-4 lg:px-24 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6 text-blue-700 flex items-center justify-center">
        About Our Bookstore
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed mb-10 text-center">
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
            className="border border-gray-200 rounded-lg p-6 transition-all duration-200 shadow-md hover:shadow-lg flex flex-col items-center text-center bg-white"
          >
            <div className={`text-${item.color}-600 p-3 rounded-full bg-${item.color}-100 mb-4`}>
              <item.icon className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-12 bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-blue-700">
          <FaHistory className="mr-2" /> Our Story
        </h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          BookHaven began as a small corner shop with a passion for connecting readers with their next favorite book. Over the years, we've grown into a beloved community hub for bibliophiles of all ages.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          What sets us apart is our dedication to personalized service. Our team of avid readers is always ready to recommend the perfect book based on your preferences. We believe that the right book can change a life, and we're here to help you find it.
        </p>
        <div className="flex items-center justify-center my-8">
          <FaQuoteLeft className="text-blue-200 text-4xl mr-4" />
          <blockquote className="italic text-gray-600 text-lg">
            "A room without books is like a body without a soul."
            <footer className="text-right text-gray-500 mt-2">— Cicero</footer>
          </blockquote>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 flex items-center text-blue-700">
            <FaUsers className="mr-2" /> Our Team
          </h3>
          <p className="text-gray-700 mb-4">
            Our passionate team of book enthusiasts is dedicated to helping you discover your next literary adventure. With expertise spanning all genres, we're here to provide personalized recommendations and exceptional service.
          </p>
          <Link to="/shop" className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium">
            Browse our collection →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 flex items-center text-blue-700">
            <FaGlobe className="mr-2" /> Our Community
          </h3>
          <p className="text-gray-700 mb-4">
            We're more than just a bookstore—we're a community hub for literary events, book clubs, and author signings. Join our community of readers and writers to share your love of literature.
          </p>
          <Link to="/login" className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium">
            Join our community →
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg shadow-md mb-12">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-700">Contact Us</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-3">
              <FaEnvelope className="text-xl" />
            </div>
            <h4 className="font-semibold mb-1">Email</h4>
            <p className="text-gray-700">info@bookhaven.com</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-3">
              <FaPhone className="text-xl" />
            </div>
            <h4 className="font-semibold mb-1">Phone</h4>
            <p className="text-gray-700">(123) 456-7890</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-3">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <h4 className="font-semibold mb-1">Location</h4>
            <p className="text-gray-700">123 Book Street, Reading City</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default About;
