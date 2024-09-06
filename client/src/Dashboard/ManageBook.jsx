import React, { useState, useEffect } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'; // Add this import

// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableColumn,
//   TableRow,
//   TableCell,
// } from "@nextui-org/table";

const ManageBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => setAllBooks(data));
  }, []);

  const handleDeleteBook = (id) => {
    console.log(id);
    fetch(`http://localhost:5000/book/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.deletedCount > 0) {
          toast.success('Book deleted successfully', { // Add this toast
            position: 'bottom-center',
          });
          setAllBooks(allBooks.filter((book) => book._id !== id));
        }
      });
  };

  return (
    <div className="container mx-auto px-4 my-8">
      <h1 className="text-3xl font-bold mb-8 text-black tracking-tight text-center">Manage Your Books</h1>
      <div className="overflow-x-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gradient-to-r from-teal-400 to-teal-600 text-white">
            <tr>
              {["No.", "Book Title", "Author Name", "Category", "Price", "Action"].map((header, index) => (
                <th key={header} scope="col" className={`px-6 py-4 font-semibold ${index === 5 ? 'text-center' : ''}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allBooks.map((book, index) => (
              <tr key={book._id} className="bg-white border-b hover:bg-teal-50 transition duration-150 ease-in-out">
                <th scope="row" className="px-6 py-4 font-bold text-teal-600">
                  {index + 1}
                </th>
                <td className="px-6 py-4 font-semibold text-gray-800">{book.bookTitle}</td>
                <td className="px-6 py-4 text-gray-600">{book.authorName}</td>
                <td className="px-6 py-4 text-gray-600">{book.category}</td>
                <td className="px-6 py-4 font-semibold text-teal-600">${book.price}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-8">
                    <Link to={`/admin/dashboard/edit-book/${book._id}`} className="font-medium text-teal-600 hover:text-teal-800 transition duration-150 ease-in-out">
                      <FaRegEdit className="text-lg" />
                    </Link>
                    <button onClick={() => handleDeleteBook(book._id)} className="font-medium text-red-600 hover:text-red-800 transition duration-150 ease-in-out">
                      <FaRegTrashAlt className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toaster /> {/* Add this at the end of the component */}
    </div>
  );
};

export default ManageBook;
