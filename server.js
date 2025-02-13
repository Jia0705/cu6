require("dotenv").config();
// import express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create the express app
const app = express();

// middleware to handle JSON request
app.use(express.json());

// setup cors policy
app.use(cors());

// connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/moviedb")
  .then(() => {
    // if mongodb is successfully connected
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.log(error);
  });

// root route
app.get("/", (req, res) => {
  res.send("Good luck!");
});

// INSTRUCTION: setup the routes here
const movieRoutes = require("./routes/movie");

app.use("/api/movies", movieRoutes);
app.use("/api/genres", require("./routes/genre"));
app.use("/api/directors", require("./routes/director"));
app.use("/api/auth", require("./routes/auth"));


// start the server
app.listen(5555, () => {
  console.log("Server is running at http://localhost:5555");
});
