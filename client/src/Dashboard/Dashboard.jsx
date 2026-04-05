import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("all"); // "all", "month", "week"

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/all-books`)
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

  // Filter books based on time range
  const getFilteredBooks = () => {
    if (timeRange === "all") return books;

    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === "month") {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === "week") {
      cutoffDate.setDate(now.getDate() - 7);
    }

    // Assuming each book has a createdAt field
    // If not, you'll need to adjust this logic
    return books.filter((book) => {
      const bookDate = new Date(book.createdAt || Date.now());
      return bookDate >= cutoffDate;
    });
  };

  const filteredBooks = getFilteredBooks();

  const totalBooks = filteredBooks.length;
  const totalAuthors = new Set(filteredBooks.map((book) => book.authorName))
    .size;
  const totalCategories = new Set(filteredBooks.map((book) => book.category))
    .size;
  const averagePrice =
    totalBooks > 0
      ? filteredBooks.reduce((sum, book) => sum + parseFloat(book.price), 0) /
      totalBooks
      : 0;

  const categoryCounts = filteredBooks.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  const uniqueColors = [
    "rgba(255, 99, 132, 0.8)", // Red
    "rgba(54, 162, 235, 0.8)", // Blue
    "rgba(255, 206, 86, 0.8)", // Yellow
    "rgba(75, 192, 192, 0.8)", // Teal
    "rgba(153, 102, 255, 0.8)", // Purple
    "rgba(255, 159, 64, 0.8)", // Orange
    "rgba(46, 204, 113, 0.8)", // Green
    "rgba(236, 112, 99, 0.8)", // Light Red
    "rgba(52, 152, 219, 0.8)", // Light Blue
    "rgba(241, 196, 15, 0.8)", // Gold
    "rgba(230, 126, 34, 0.8)", // Dark Orange
    "rgba(155, 89, 182, 0.8)", // Lavender
    "rgba(26, 188, 156, 0.8)", // Turquoise
    "rgba(231, 76, 60, 0.8)", // Crimson
    "rgba(52, 73, 94, 0.8)", // Dark Blue Gray
    "rgba(243, 156, 18, 0.8)", // Dark Yellow
    "rgba(211, 84, 0, 0.8)", // Burnt Orange
    "rgba(189, 195, 199, 0.8)", // Light Gray
    "rgba(127, 140, 141, 0.8)", // Dark Gray
    "rgba(44, 62, 80, 0.8)", // Navy Blue
    "rgba(22, 160, 133, 0.8)", // Green Sea
    "rgba(192, 57, 43, 0.8)", // Dark Red
    "rgba(142, 68, 173, 0.8)", // Dark Purple
    "rgba(39, 174, 96, 0.8)", // Emerald
    "rgba(241, 148, 138, 0.8)", // Light Coral
  ];

  // Bar Chart Data
  const barChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Books per Category",
        data: Object.values(categoryCounts),
        backgroundColor: uniqueColors.slice(
          0,
          Object.keys(categoryCounts).length
        ),
        borderColor: uniqueColors
          .slice(0, Object.keys(categoryCounts).length)
          .map((color) => color.replace("0.8", "1")),
        borderWidth: 2,
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: uniqueColors.slice(
          0,
          Object.keys(categoryCounts).length
        ),
        borderColor: uniqueColors
          .slice(0, Object.keys(categoryCounts).length)
          .map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  // Price Range Distribution
  const getPriceRanges = () => {
    const ranges = {
      "Under $10": 0,
      "$10-$20": 0,
      "$20-$30": 0,
      "$30-$40": 0,
      "$40+": 0,
    };

    filteredBooks.forEach((book) => {
      const price = parseFloat(book.price);
      if (price < 10) ranges["Under $10"]++;
      else if (price < 20) ranges["$10-$20"]++;
      else if (price < 30) ranges["$20-$30"]++;
      else if (price < 40) ranges["$30-$40"]++;
      else ranges["$40+"]++;
    });

    return ranges;
  };

  const priceRanges = getPriceRanges();

  // Line Chart Data (Mock sales data - replace with real data if available)
  const generateMockSalesData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    return {
      labels: months.slice(currentMonth - 5, currentMonth + 1),
      datasets: [
        {
          label: "Sales",
          data: Array.from(
            { length: 6 },
            () => Math.floor(Math.random() * 50) + 10
          ),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const lineChartData = generateMockSalesData();

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
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y || context.parsed;
            const percentage = ((value / totalBooks) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "rgba(255, 255, 255, 1)",
        bodyColor: "rgba(255, 255, 255, 1)",
        borderColor: "rgba(255, 255, 255, 0.3)",
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

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Category Distribution",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / totalBooks) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Trend",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Books Sold",
        },
      },
    },
  };

  const AnimatedStatistic = ({ value, label, decimals = 0, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-700">{label}</h2>
        {icon && <div className="text-teal-500 text-2xl">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-teal-600">
        {decimals > 0 && "$"}
        <CountUp end={value} decimals={decimals} duration={2.5} />
      </p>
    </div>
  );

  const bestSellingBook =
    books.length > 0
      ? books.reduce(
        (best, book) =>
          book.salesCount > (best?.salesCount || 0) ? book : best,
        books[0]
      )
      : null;

  const topAuthor =
    books.length > 0
      ? Object.entries(
        books.reduce((acc, book) => {
          acc[book.authorName] = (acc[book.authorName] || 0) + 1;
          return acc;
        }, {})
      ).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : null;

  const highestPricedBook =
    books.length > 0
      ? books.reduce(
        (highest, book) =>
          parseFloat(book.price) > parseFloat(highest?.price || 0)
            ? book
            : highest,
        books[0]
      )
      : null;

  const lowestPricedBook =
    books.length > 0
      ? books.reduce(
        (lowest, book) =>
          parseFloat(book.price) < parseFloat(lowest?.price || Infinity)
            ? book
            : lowest,
        books[0]
      )
      : null;

  const totalInventoryValue = filteredBooks.reduce(
    (sum, book) => sum + parseFloat(book.price),
    0
  );

  const mostPopularCategory =
    Object.keys(categoryCounts).length > 0
      ? Object.entries(categoryCounts).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0]
      : null;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg p-4 shadow-md">
        Error: {error}
      </div>
    );

  return (
    <div className="p-5 bg-white w-full min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center tracking-tight mb-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-transparent bg-clip-text">
          BookHaven Dashboard
        </h1>
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setTimeRange("all")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeRange === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("month")}
              className={`px-4 py-2 text-sm font-medium ${timeRange === "month"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              Last Month
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("week")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeRange === "week"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              Last Week
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <AnimatedStatistic
          value={totalBooks}
          label="Total Books"
          icon={<i className="fas fa-book"></i>}
        />
        <AnimatedStatistic
          value={totalAuthors}
          label="Total Authors"
          icon={<i className="fas fa-user"></i>}
        />
        <AnimatedStatistic
          value={totalCategories}
          label="Total Categories"
          icon={<i className="fas fa-tags"></i>}
        />
        <AnimatedStatistic
          value={averagePrice}
          label="Average Price"
          decimals={2}
          icon={<i className="fas fa-dollar-sign"></i>}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Category Distribution
          </h2>
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Price Range Distribution
          </h2>
          <ul className="space-y-4">
            {Object.entries(priceRanges).map(([range, count]) => (
              <li key={range} className="flex items-center">
                <span className="w-24 font-medium text-gray-700">{range}:</span>
                <div className="flex-1 ml-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-teal-600 h-4 rounded-full"
                      style={{ width: `${(count / totalBooks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-2 text-gray-600">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Best Selling Book
          </h2>
          <p className="text-lg font-medium text-teal-600">
            {bestSellingBook?.bookTitle || "N/A"}
          </p>
          {bestSellingBook && (
            <p className="text-sm text-gray-600 mt-1">
              by {bestSellingBook.authorName}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Top Author
          </h2>
          <p className="text-lg font-medium text-teal-600">
            {topAuthor || "N/A"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {topAuthor &&
              `${books.filter((book) => book.authorName === topAuthor).length
              } books`}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Most Popular Category
          </h2>
          <p className="text-lg font-medium text-teal-600">
            {mostPopularCategory || "N/A"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {mostPopularCategory &&
              `${categoryCounts[mostPopularCategory]} books`}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Inventory Value
          </h2>
          <p className="text-lg font-medium text-teal-600">
            ${totalInventoryValue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Across {totalBooks} books
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Books
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.slice(0, 5).map((book, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {book.bookTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {book.authorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${book.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
