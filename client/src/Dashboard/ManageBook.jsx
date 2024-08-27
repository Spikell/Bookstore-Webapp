import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
// import { Table } from "flowbite-react";

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
          alert("Book deleted successfully");
          setAllBooks(allBooks.filter((book) => book._id !== id));
        }
      });
  };

  return (
    <div className="px-4 my-8">
      <h1 className="text-2xl font-bold mb-8">Manage your Books</h1>
      {/* Table for book data */}
      <table class="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <thead class=" text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-12 py-2 normal-case">
              No.
            </th>
            <th scope="col" className="px-12 py-2 ">
              Book Title
            </th>
            <th scope="col" className="px-12 py-2">
              Author Name
            </th>
            <th scope="col" className="px-12 py-2">
              Category
            </th>
            <th scope="col" className="px-12 py-2">
              Price
            </th>
            <th scope="col" className="px-12 py-2">
              Action
            </th>
          </tr>
        </thead>
        {allBooks.map((book, index) => (
          <tbody className="divide-y" key={book._id}>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {index + 1}
              </th>
              <td className="px-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {book.bookTitle}
              </td>
              <td className="px-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {book.authorName}
              </td>
              <td className="px-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {book.category}
              </td>
              <td className="px-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${book.price}
              </td>
              <td className="px-12 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <Link
                  className="flex-wrap justify-center items-center"
                  to={`/admin/dashboard/edit-book/${book._id}`}
                >
                  <button className="text-blue-600 hover:text-blue-400 mr-8 size-4">
                    <FaRegEdit />
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className=" text-red-600 hover:text-red-400"
                >
                  <FaRegTrashAlt />
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default ManageBook;
