const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const {
  getDirectors,
  getDirector,
  addNewDirector,
  updateDirector,
  deleteDirector,
} = require("../controllers/director");

const { isValidStaff, isAdmin } = require("../middleware/auth");

// Get all the directors (Public)
router.get("/", async (req, res) => {
  try {
    const directors = await getDirectors();
    res.status(200).send(directors);
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// Get one director by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const director = await getDirector(id);
    if (director) {
      res.status(200).send(director);
    } else {
      res.status(404).send({ error: "Director not found" });
    }
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// Add new director (Staff or Admin)
router.post("/", isValidStaff, async (req, res) => {
  try {
    const { name, bio, contact, moviesDirected } = req.body;
    if (!name) {
      return res.status(400).send({ error: "Error: Required data is missing!" });
    }

    const newDirector = await addNewDirector(name, bio, contact, moviesDirected);
    res.status(201).send(newDirector);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error._message });
  }
});

// Edit director (Staff or Admin)
router.put("/:id", isValidStaff, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, bio, contact, moviesDirected } = req.body;

    const updatedDirector = await updateDirector(id, name, bio, contact, moviesDirected);
    res.status(200).send(updatedDirector);
  } catch (error) {
    res.status(400).send({ error: error._message });
  }
});

// Delete director (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }

    const director = await getDirector(id);
    if (!director) {
      return res.status(404).send({
        error: `Error: No match for a director found with the id "${id}".`,
      });
    }

    await deleteDirector(id);
    res.status(200).send({
      message: `Director with id #${id} has been deleted.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error._message });
  }
});

module.exports = router;
