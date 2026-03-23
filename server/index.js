require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ["https://bookstore-webapp-frontend.vercel.app", "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/static', express.static('public'));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//mongodb config
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not set in the environment variables");
  // Don't exit process in serverless environment
  throw new Error("MongoDB URI is missing");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Define a cached connection variable
let cachedDb = null;

// Function to connect to the database
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    await client.connect();
    const db = client.db("BookInventory");
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error; // Don't exit process, just throw the error
  }
}

// Define routes outside the connection function
app.post("/upload-book", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bookCollections = db.collection("books");
    const data = req.body;
    const result = await bookCollections.insertOne(data);
    res.send(result);
  } catch (error) {
    console.error("Error in /upload-book:", error);
    res.status(500).send("An error occurred while uploading the book");
  }
});

app.post("/upload-books", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bookCollections = db.collection("books");
    const data = req.body;
    const result = await bookCollections.insertMany(data);
    res.send(result);
  } catch (error) {
    console.error("Error in /upload-books:", error);
    res.status(500).send("An error occurred while uploading books");
  }
});

app.patch("/book/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bookCollections = db.collection("books");
    const id = req.params.id;
    const updateBookData = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        ...updateBookData,
      },
    };
    const options = { upsert: true };
    const result = await bookCollections.updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    console.error("Error in /book/:id PATCH:", error);
    res.status(500).send("An error occurred while updating the book");
  }
});

app.delete("/book/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bookCollections = db.collection("books");
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await bookCollections.deleteOne(filter);
    res.send(result);
  } catch (error) {
    console.error("Error in /book/:id DELETE:", error);
    res.status(500).send("An error occurred while deleting the book");
  }
});

app.get("/book/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bookCollections = db.collection("books");
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await bookCollections.findOne(filter);
    res.send(result);
  } catch (error) {
    console.error("Error in /book/:id GET:", error);
    res.status(500).send("An error occurred while fetching the book");
  }
});

app.get("/all-books", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bookCollections = db.collection("books");
    let query = {};
    if (req.query?.category) {
      query = { category: { $regex: new RegExp(req.query.category, "i") } };
    }
    if (req.query?.bookTitle) {
      query = { bookTitle: { $regex: new RegExp(req.query.bookTitle, "i") } };
    }
    const result = await bookCollections.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error in /all-books route:", error);
    res.status(500).send("An error occurred while fetching books");
  }
});

// Add a general error handler for all routes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("An unexpected error occurred");
});

// Only start the server if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// For serverless environments
module.exports = app;
