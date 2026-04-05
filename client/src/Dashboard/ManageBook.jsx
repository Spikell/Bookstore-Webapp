import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { bookCategories } from "../data";
import "./CatScrollBar.css";

const ManageBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(20);
  const [sortField, setSortField] = useState("bookTitle");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/all-books`)
      .then((res) => res.json())
      .then((data) => {
        setAllBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching books:", err);
        toast.error("Failed to load books");
        setLoading(false);
      });
  }, []);

  const handleDeleteBook = (id) => {
    toast.loading("Deleting book...");
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/book/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss();
        if (data.deletedCount > 0) {
          toast.success('Book deleted successfully', {
            position: 'bottom-center',
          });
          setAllBooks(allBooks.filter((book) => book._id !== id));
        } else {
          toast.error('Failed to delete book');
        }
      })
      .catch(err => {
        toast.dismiss();
        toast.error('Error deleting book');
        console.error("Error deleting book:", err);
      });
  };

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort books
  const filteredBooks = allBooks
    .filter(book => {
      const matchesSearch = book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? book.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (a[sortField] > b[sortField]) {
        comparison = 1;
      } else if (a[sortField] < b[sortField]) {
        comparison = -1;
      }
      return sortDirection === "desc" ? comparison * -1 : comparison;
    });

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-teal-50'
              } text-sm font-medium`}
          >
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Show limited page numbers with ellipsis
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                    ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              (pageNumber === currentPage - 2 && pageNumber > 1) ||
              (pageNumber === currentPage + 2 && pageNumber < totalPages)
            ) {
              return (
                <span
                  key={pageNumber}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-teal-50'
              } text-sm font-medium`}
          >
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    );
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
    setShowCategoryDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setFilterCategory(category.label);
    setShowCategoryDropdown(false);
  };

  const filteredCategories = useMemo(() => {
    if (!filterCategory) return bookCategories;
    return bookCategories.filter((cat) =>
      cat.label.toLowerCase().includes(filterCategory.toLowerCase())
    );
  }, [filterCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 my-8">
      <h1 className="text-3xl font-bold mb-6 tracking-tight text-center bg-gradient-to-r from-teal-600 to-cyan-500 text-transparent bg-clip-text">Manage Your Books</h1>

      {/* Search and Filter Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 !bg-white !text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <div className="relative" ref={categoryDropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by category..."
                value={filterCategory}
                onChange={handleCategoryChange}
                onFocus={() => setShowCategoryDropdown(true)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 !bg-white !text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
              {showCategoryDropdown && (
                <ul className="modern-scrollbar absolute z-10 w-full top-full mt-1 !bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCategories.map((category) => (
                    <li
                      key={category.value}
                      onClick={() => handleCategorySelect(category)}
                      className="px-4 py-2 !text-gray-800 hover:bg-teal-50 cursor-pointer transition-colors duration-150"
                    >
                      {category.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Link
              to="/admin/dashboard/upload"
              className="inline-flex justify-center items-center w-full md:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              + Add New Book
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
          {(searchTerm || filterCategory) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("");
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gradient-to-r from-teal-400 to-teal-600 text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">No.</th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold cursor-pointer"
                    onClick={() => handleSort("bookTitle")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Book Title</span>
                      {sortField === "bookTitle" && (
                        sortDirection === "asc" ? <FaSortAmountUp className="text-xs" /> : <FaSortAmountDown className="text-xs" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold cursor-pointer"
                    onClick={() => handleSort("authorName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Author Name</span>
                      {sortField === "authorName" && (
                        sortDirection === "asc" ? <FaSortAmountUp className="text-xs" /> : <FaSortAmountDown className="text-xs" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {sortField === "category" && (
                        sortDirection === "asc" ? <FaSortAmountUp className="text-xs" /> : <FaSortAmountDown className="text-xs" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-semibold cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Price</span>
                      {sortField === "price" && (
                        sortDirection === "asc" ? <FaSortAmountUp className="text-xs" /> : <FaSortAmountDown className="text-xs" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book, index) => (
                  <tr key={book._id} className="bg-white border-b transition duration-150 ease-in-out hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-bold text-teal-600">
                      {indexOfFirstBook + index + 1}
                    </th>
                    <td className="px-6 py-4 font-semibold text-gray-800">{book.bookTitle}</td>
                    <td className="px-6 py-4 text-gray-600">{book.authorName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-teal-600">${book.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-4">
                        <Link
                          to={`/admin/dashboard/edit-book/${book._id}`}
                          className="font-medium text-teal-600 hover:text-teal-800 hover:bg-teal-100 p-2 rounded-full transition duration-150 ease-in-out"
                          title="Edit Book"
                        >
                          <FaRegEdit className="text-lg" />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${book.bookTitle}"?`)) {
                              handleDeleteBook(book._id);
                            }
                          }}
                          className="font-medium text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-full transition duration-150 ease-in-out"
                          title="Delete Book"
                        >
                          <FaRegTrashAlt className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}

          {/* Results summary */}
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length} books
          </div>
        </>
      )}

      <Toaster />
    </div>
  );
};

export default ManageBook;
