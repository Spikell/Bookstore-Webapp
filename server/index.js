require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
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
  process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create a collection of documents for our database
    const bookCollections = client.db("BookInventory").collection("books");

    //insert a book to db: post method
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    });

    //insert multiple books to db: post method
    app.post("/upload-books", async (req, res) => {
      const data = req.body;
      const result = await bookCollections.insertMany(data);
      res.send(result);
    });


    //update book data : patch or update methods
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          ...updateBookData,
        },
      };
      const options = { upsert: true };

      //update
      const result = await bookCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //delete book data from db
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    });

    // find single book data with id
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.findOne(filter);
      res.send(result);
    });

    // find book by category or title
    app.get("/all-books", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: { $regex: new RegExp(req.query.category, "i") } };
      }
      if (req.query?.bookTitle) {
        query = { bookTitle: { $regex: new RegExp(req.query.bookTitle, "i") } };
      }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch((error) => {
  console.error("Unhandled error in run function:", error);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
