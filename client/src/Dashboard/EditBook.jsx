import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Textarea } from "flowbite-react";
import { bookCategories } from "../data";
import toast, { Toaster } from 'react-hot-toast';
import Select from "react-select";
import "./CatScrollBar.css"; 

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bookData, setBookData] = useState({
    bookTitle: '',
    authorName: '',
    imageURL: '',
    category: '',
    bookPdfURL: '',
    description: '',
    price: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch book data when component mounts
    fetch(`http://localhost:5000/book/${id}`)
      .then(res => res.json())
      .then(data => {
        setBookData(data);
        setSelectedCategory(data.category);
      })
      .catch(error => {
        console.error("Error fetching book data:", error);
        toast.error('Error loading book data. Please try again.');
      });
  }, [id]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setShowDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.label);
    setShowDropdown(false);
  };

  const filteredCategories = useMemo(() => {
    if (!selectedCategory) return bookCategories;
    return bookCategories.filter((category) =>
      category.label.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBookEdit = (event) => {
    event.preventDefault();
    const form = event.target;

    const editbookObj = {
      bookTitle: form.bookTitle.value,
      authorName: form.authorName.value,
      imageURL: form.imageURL.value,
      category: form.category.value,
      bookPdfURL: form.bookPdfURL.value,
      description: form.description.value,
      price: form.price.value,
    };

    // Update the fetch request
    fetch(`http://localhost:5000/book/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editbookObj),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          toast.success('Book updated successfully!', {
            position: 'bottom-center',
          });
          setTimeout(() => {
            navigate('/admin/dashboard/manage');
          }, 2000);
        } else {
          toast.error('No changes were made to the book.', {
            position: 'bottom-center',
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error('Error updating book. Please try again.', {
          position: 'bottom-center',
        });
      });
  };

  return (
    <div className="px-4 my-8">
      <h2 className="mb-8 ml-20 mr-48 text-3xl font-bold  text-center tracking-tight">Edit Book</h2>
      <form
        onSubmit={handleBookEdit}
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
              defaultValue={bookData.bookTitle}
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
              defaultValue={bookData.authorName}
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
                defaultValue={bookData.imageURL}
                required
                className="w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            {/* Category*/}
            <div className="flex flex-col lg:w-[600px] relative" ref={dropdownRef}>
              <label
                htmlFor="category"
                className="mb-2 block text-md font-semibold text-gray-700"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Enter or select a category"
                required
                className="w-9/12 rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
              />
              {showDropdown && (
                <ul className="modern-scrollbar absolute z-10 w-9/12 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCategories.map((category) => (
                    <li
                      key={category.value}
                      onClick={() => handleCategorySelect(category)}
                      className="px-4 py-2 hover:bg-teal-50 cursor-pointer transition-colors duration-150"
                    >
                      {category.label}
                    </li>
                  ))}
                </ul>
              )}
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
              defaultValue={bookData.bookPdfURL}
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
              defaultValue={bookData.price}
              step="0.01"
              min="0"
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
              defaultValue={bookData.description}
              required
              className="w-full rounded-md border border-gray-400 bg-gray-50 p-2 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <button className=" bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-all duration-200 md:ml-96 mt-8">
            Update Book
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default EditBook;
