const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const {
  getGenres,
  addNewGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genre");

const { isValidStaff, isAdmin } = require("../middleware/auth");

// Get all genres (Public)
router.get("/", async (req, res) => {
  try {
    const genres = await getGenres();
    res.status(200).send(genres);
  } catch (error) {
    res.status(400).send({ error: error._message });
  }
});

// Add new genre (Staff or Admin)
router.post("/", isValidStaff, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: "Error: Required data is missing!" });
    }

    const newGenre = await addNewGenre(name);
    res.status(201).send(newGenre);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error._message });
  }
});

// Edit genre (Staff or Admin)
router.put("/:id", isValidStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedGenre = await updateGenre(id, name);
    res.status(200).send(updatedGenre);
  } catch (error) {
    res.status(400).send({ error: error._message });
  }
});

// Delete genre (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }

    const result = await deleteGenre(id);
    if (!result) {
      return res.status(404).send({
        error: `Error: No genre found with the id "${id}".`,
      });
    }

    res.status(200).send({
      message: `Genre with ID #${id} has been deleted.`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error._message });
  }
});

module.exports = router;
