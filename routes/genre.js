// routes/genres.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

/* INSTRUCTION: setup the genre router here:
    - GET /genres: List all genres (public)
    - POST /genres: Add a new genre (staff or admin)
    - PUT /genres/:id: Update a genre (staff or admin)
    - DELETE /genres/:id: Delete a genre (admin only)
*/
const {
  getGenres,
  addNewGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genre");

const { isAdmin } = require("../middleware/auth");

// get all the genres. Pointing to /genres
router.get("/", async (req, res) => {
  try {
    const genres = await getGenres();
    res.status(200).send(genres);
  } catch (error) {
    res.status(400).send({
      error: error._message, 
    });
  }
});

// add new genre
router.post("/", async (req, res) => {
  try {
    // Retrieve the data from req.body
    const name = req.body.name;

    // Check for errors
    if (!name) {
      return res.status(400).send({
        error: "Error: Required data is missing!",
      });
    }
    // If no errors, pass in all the data to addNewGenre function from controller
    const newGenre = await addNewGenre(name);
    res.status(200).send(newGenre);
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message, 
    });
  }
});

// edit genre
router.put("/:id", async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    // Retrieve the data from req.body
    const name = req.body.name;

    const updatedGenre = await updateGenre(id, name);
    res.status(200).send(updatedGenre);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message, 
    });
  }
});

// delete genre
router.delete("/:id", async (req, res) => { 
  try {
    const id = req.params.id;

    // Validate the ID format before querying the database
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
      message: `Alert: Genre with the provided id #${id} has been deleted`,
    });

  } catch (error) {
    console.log(error);
    res.status(404).send({
      error: error._message, 
    });
  }
});


module.exports = router;
