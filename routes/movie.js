// routes/movies.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

/* 
    INSTRUCTION: setup the movie router here:
    - GET /movies: List all movies (public)
    - GET /movies/:id: Get a specific movie by its id (public)
    - POST /movies: Add a new movie (staff or admin)
    - PUT /movies/:id: Update a movie (staff or admin)
    - DELETE /movies/:id: Delete a movie (admin only)
*/

const {
  getMovies,
  getMovie,
  addNewMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movie");

const { isAdmin } = require("../middleware/auth");

// get all the movies. Pointing to /movies
router.get("/", async (req, res) => {
  try {
    const movies = await getMovies();
    res.status(200).send(movies);
  } catch (error) {
    res.status(400).send({
      error: error._message, 
    });
  }
});

// get one movie by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const movie = await getMovie(id);
    if (movie) {
      res.status(200).send(movie);
    } else {
      res.status(400).send("Movie not Found");
    }
  } catch (error) {
    res.status(400).send({
      error: error._message, 
    });
  }
});

// add new movie
router.post("/", async (req, res) => {
  try {
    // Retrieve the data from req.body
    const title = req.body.title;
    const director = req.body.director;
    const genre = req.body.genre;
    const releaseDate = req.body.releaseDate;
    const description = req.body.description;

    // Check for errors
    if (!title || !director || !genre || !releaseDate) {
      return res.status(400).send({
        error: "Error: Required data is missing!",
      });
    }
    // If no errors, pass in all the data to addNewMovie function from controller
    const newMovie = await addNewMovie(
      title,
      director,
      genre,
      releaseDate,
      description
    );
    res.status(200).send(newMovie);
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message, 
    });
  }
});

// edit movie
router.put("/:id", async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    // Retrieve the data from req.body
    const title = req.body.title;
    const director = req.body.director;
    const genre = req.body.genre;
    const releaseDate = req.body.releaseDate;
    const description = req.body.description;

    const updatedMovie = await updateMovie(
      id,
      title,
      director,
      genre,
      releaseDate,
      description
    );
    res.status(200).send(updatedMovie);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message, 
    });
  }
});

// delete movie
router.delete("/:id", async (req, res) => {
  try {
    // Retrieve the id from the URL
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const movie = await getMovie(id);
    // If the movie does not exist
    if (!movie) {
      /* !movie because it is returning either a single object or null */
      return res.status(404).send({
        error: `Error: No match for a movie found with the id "${id}".`,
      });
    }

    const status = await deleteMovie(id);
    res.status(200).send({
      message: `Alert: Movie with the provided id #${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message, 
    });
  }
});

module.exports = router;
