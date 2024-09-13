import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import CountUp from "react-countup";
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

  const uniqueColors = [
    'rgba(255, 99, 132, 0.8)',   // Red
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(255, 206, 86, 0.8)',   // Yellow
    'rgba(75, 192, 192, 0.8)',   // Teal
    'rgba(153, 102, 255, 0.8)',  // Purple
    'rgba(255, 159, 64, 0.8)',   // Orange
    'rgba(46, 204, 113, 0.8)',   // Green
    'rgba(236, 112, 99, 0.8)',   // Light Red
    'rgba(52, 152, 219, 0.8)',   // Light Blue
    'rgba(241, 196, 15, 0.8)',   // Gold
    'rgba(230, 126, 34, 0.8)',   // Dark Orange
    'rgba(155, 89, 182, 0.8)',   // Lavender
    'rgba(26, 188, 156, 0.8)',   // Turquoise
    'rgba(231, 76, 60, 0.8)',    // Crimson
    'rgba(52, 73, 94, 0.8)',     // Dark Blue Gray
    'rgba(243, 156, 18, 0.8)',   // Dark Yellow
    'rgba(211, 84, 0, 0.8)',     // Burnt Orange
    'rgba(189, 195, 199, 0.8)',  // Light Gray
    'rgba(127, 140, 141, 0.8)',  // Dark Gray
    'rgba(44, 62, 80, 0.8)',     // Navy Blue
    'rgba(22, 160, 133, 0.8)',   // Green Sea
    'rgba(192, 57, 43, 0.8)',    // Dark Red
    'rgba(142, 68, 173, 0.8)',   // Dark Purple
    'rgba(39, 174, 96, 0.8)',    // Emerald
    'rgba(241, 148, 138, 0.8)',  // Light Coral
  ];

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Books per Category",
        data: Object.values(categoryCounts),
        backgroundColor: uniqueColors.slice(0, Object.keys(categoryCounts).length),
        borderColor: uniqueColors.slice(0, Object.keys(categoryCounts).length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Books per Category",
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const percentage = ((value / totalBooks) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const AnimatedStatistic = ({ value, label, decimals = 0 }) => (
    <div className="bg-white rounded-lg shadow-md p-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{label}</h2>
      <p className="text-3xl font-bold text-blue-600">
        {decimals > 0 && "$"}
        <CountUp end={value} decimals={decimals} duration={2.5} />
      </p>
    </div>
  );

  const bestSellingBook = books.reduce((best, book) => 
    (book.salesCount > (best?.salesCount || 0)) ? book : best, null);

  const topAuthor = Object.entries(books.reduce((acc, book) => {
    acc[book.authorName] = (acc[book.authorName] || 0) + 1;
    return acc;
  }, {})).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  const highestPricedBook = books.reduce((highest, book) => 
    (parseFloat(book.price) > parseFloat(highest?.price || 0)) ? book : highest, null);

  const lowestPricedBook = books.reduce((lowest, book) => 
    (parseFloat(book.price) < parseFloat(lowest?.price || Infinity)) ? book : lowest, null);

  const totalInventoryValue = books.reduce((sum, book) => sum + parseFloat(book.price), 0);

  const mostPopularCategory = Object.entries(categoryCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

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
        <AnimatedStatistic
          value={averagePrice}
          label="Average Price"
          decimals={2}
        />
        <AnimatedStatistic value={totalInventoryValue} label="Total Inventory Value" decimals={2} />
        <div className="bg-white rounded-lg shadow-md p-5 col-span-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Category Distribution
          </h2>
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
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
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Best Selling Book</h2>
          <p className="text-lg">{bestSellingBook?.bookTitle || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Top Author</h2>
          <p className="text-lg">{topAuthor || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Most Popular Category</h2>
          <p className="text-lg">{mostPopularCategory || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
