import React, { useState } from "react";
import { Textarea } from "flowbite-react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { bookCategories } from "../data";


const UploadBook = () => {

  // const placements = ["outside"];

  const [selectedCategory, setSelectedCategory] = useState(bookCategories[0]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // handle form submission
  const handleBookSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const bookTitle = form.bookTitle.value;
    const authorName = form.authorName.value;
    const imageURL = form.imageURL.value;
    const category = form.category.value;
    const bookPdfURL = form.bookPdfURL.value;
    const description = form.description.value;
    const price = form.price.value;

    const bookObj = {
      bookTitle,
      authorName,
      imageURL,
      category,
      bookPdfURL,
      description,
      price,
    };
    console.log(bookObj);

    // save book to database
    fetch("http://localhost:5000/upload-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookObj),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Book uploaded successfully!!");
        form.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error uploading book!!");
      });
  };

  return (
    <div className="px-4  my-8">
      <h2 className="mb-8 text-2xl font-bold">Upload a Book</h2>
      <form
        onSubmit={handleBookSubmit}
        className="flex flex-col lg:w-[1180px] flex-wrap gap-4"
      >
        {/* First row */}
        <div className="flex flex-col lg:flex-row justify-center items-center">
          <div className="w-full lg:w-[600px]">
            <label
              htmlFor="bookTitle"
              className="mb-2 block text-md font-semibold text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              placeholder="Enter book title"
              required
              className="w-[350px] lg:w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          {/* Author Name*/}
          <div className="mt-4 md:mt-0 w-full lg:w-[600px] ">
            <label
              htmlFor="authorName"
              className="mb-2 block text-md font-semibold text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              placeholder="Enter author name"
              required
              className="w-[350px] lg:w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>
        {/* Second row */}
        <div className="flex flex-col lg:flex-row flex-wrap my-4">
          <div className="flex">
            {/* Image URL */}
            <div className="w-full lg:w-[600px]">
              <label
                htmlFor="imageURL"
                className="mb-2 block text-md font-semibold text-gray-700"
              >
                Book Image URL
              </label>
              <input
                type="text"
                id="imageURL"
                name="imageURL"
                placeholder="Enter image URL"
                required
                className="w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            {/* Category*/}
            <div className="flex flex-col lg:w-[600px]">
              <label
                htmlFor="category"
                className="mb-2 block text-md font-semibold text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
                className="w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
              >
                {bookCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* 3rd row */}
        <div className="flex flex-col lg:flex-row">
          {/* pdf url */}
          <div className="w-full lg:w-[600px]">
            <label
              htmlFor="bookPdfURL"
              className="mb-2 block text-md font-semibold text-gray-700"
            >
              Book PDF URL
            </label>
            <input
              type="text"
              id="bookPdfURL"
              name="bookPdfURL"
              placeholder="Enter PDF URL"
              required
              className="w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          {/* price */}
          <div className="w-full lg:w-[600px]">
            <label
              htmlFor="price"
              className="mb-2 block text-md font-semibold text-gray-700"
            >
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Enter price"
              required
              className="w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-5000"
            />
          </div>
        </div>
        {/* 4th row */}
        <div>
          {/* Description */}
          <div className="w-full lg:w-[600px] pt-6">
            <label
              htmlFor="description"
              className="mb-2 block text-md font-semibold text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter book description"
              rows={6}
              required
              className="w-full rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <button className=" bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-all duration-200 md:ml-96 mt-8">
            Upload Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadBook;
