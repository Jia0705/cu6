const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const {
  getMovies,
  getMovie,
  addNewMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movie");

const { isValidStaff, isAdmin } = require("../middleware/auth");

// Get all movies (Public)
router.get("/", async (req, res) => {
  try {
    const movies = await getMovies();
    res.status(200).send(movies);
  } catch (error) {
    res.status(400).send({ error: error._message });
  }
});

// Get one movie by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }

    const movie = await getMovie(id);
    if (!movie) {
      return res.status(404).send({ error: "Movie not found" });
    }

    res.status(200).send(movie);
  } catch (error) {
    res.status(400).send({ error: error._message });
  }
});

// Add new movie (Staff or Admin)
router.post("/", isValidStaff, async (req, res) => {
  try {
    const { title, director, genre, releaseDate, description } = req.body;

    if (!title || !director || !genre || !releaseDate) {
      return res.status(400).send({ error: "Error: Required data is missing!" });
    }

    const newMovie = await addNewMovie(title, director, genre, releaseDate, description);
    res.status(201).send(newMovie);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error._message });
  }
});

// Edit movie (Staff or Admin)
router.put("/:id", isValidStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, director, genre, releaseDate, description } = req.body;

    const updatedMovie = await updateMovie(id, title, director, genre, releaseDate, description);
    res.status(200).send(updatedMovie);
  } catch (error) {
    res.status(400).send({ error: error._message });
  }
});

// Delete movie (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }

    const movie = await getMovie(id);
    if (!movie) {
      return res.status(404).send({ error: `No movie found with the id "${id}".` });
    }

    await deleteMovie(id);
    res.status(200).send({ message: `Movie with ID #${id} has been deleted.` });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error._message });
  }
});

module.exports = router;
