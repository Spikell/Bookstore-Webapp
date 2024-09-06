import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import CountUp from 'react-countup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Received books data:", data);
        setBooks(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching books:", e);
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const totalBooks = books.length;
  const totalAuthors = new Set(books.map((book) => book.authorName)).size;
  const totalCategories = new Set(books.map((book) => book.category)).size;
  const averagePrice =
    books.reduce((sum, book) => sum + parseFloat(book.price), 0) / totalBooks;

  const categoryCounts = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Books per Category",
        data: Object.values(categoryCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Books per Category",
      },
    },
  };

  const AnimatedStatistic = ({ value, label, decimals = 0 }) => (
    <div className="bg-white rounded-lg shadow-md p-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{label}</h2>
      <p className="text-3xl font-bold text-blue-600">
        {decimals > 0 && '$'}
        <CountUp end={value} decimals={decimals} duration={2.5} />
      </p>
    </div>
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="p-5 bg-gray-100">
      <header className="mb-5">
        <h1 className="text-3xl font-bold  text-center tracking-tight text-gray-800">
          BookHaven Dashboard
        </h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatedStatistic value={totalBooks} label="Total Books" />
        <AnimatedStatistic value={totalAuthors} label="Total Authors" />
        <AnimatedStatistic value={totalCategories} label="Total Categories" />
        <AnimatedStatistic value={averagePrice} label="Average Price" decimals={2} />
        
        <div className="bg-white rounded-lg shadow-md p-5 col-span-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Category Distribution
          </h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 col-span-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Recent Sales
          </h2>
          <ul className="divide-y divide-gray-200">
            {books.slice(0, 5).map((book, index) => (
              <li key={index} className="py-2">
                <span className="font-medium">{book.bookTitle}</span> -{" "}
                <span className="text-blue-600">${book.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
