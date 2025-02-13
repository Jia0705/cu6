// routes/directors.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

/* 
    INSTRUCTION: setup the director router here:
    - GET /directors: List all directors (public)
    - GET /directors/:id: Get a specific director by its id (public)
    - POST /directors: Add a new director (staff or admin)
    - PUT /directors/:id: Update a director (staff or admin)
    - DELETE /directors/:id: Delete a director (admin only)
*/

const {
  getDirectors,
  getDirector,
  addNewDirector,
  updateDirector,
  deleteDirector,
} = require("../controllers/director");

const { isValidStaff, isAdmin } = require("../middleware/auth");

// get all the directors. Pointing to /directors
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

// get one director by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const director = await getDirector(id);
    if (director) {
      res.status(200).send(director);
    } else {
      res.status(400).send("Director not Found");
    }
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// add new director
router.post("/",  async (req, res) => {
  try {
    // Retrieve the data from req.body
    const name = req.body.name;
    const bio = req.body.bio;
    const contact = req.body.contact;
    const moviesDirected = req.body.moviesDirected;

    // Check for errors
    if (!name) {
      return res.status(400).send({
        error: "Error: Required data is missing!",
      });
    }
    // If no errors, pass in all the data to addNewDirector function from controller
    const newDirector = await addNewDirector(
      name,
      bio,
      contact,
      moviesDirected
    );
    res.status(200).send(newDirector);
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// edit director
router.put("/:id", async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    // Retrieve the data from req.body
    const name = req.body.name;
    const bio = req.body.bio;
    const contact = req.body.contact;
    const moviesDirected = req.body.moviesDirected;

    const updatedDirector = await updateDirector(
      id,
      name,
      bio,
      contact,
      moviesDirected
    );
    res.status(200).send(updatedDirector);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// delete director
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
    const director = await getDirector(id);
    // If the director does not exist
    if (!director) {
      /* !director because it is returning either a single object or null */
      return res.status(404).send({
        error: `Error: No match for a director found with the id "${id}".`,
      });
    }
    // Trigger the deleteDirector function
    const status = await deleteDirector(id);
    res.status(200).send({
      message: `Alert: Director with the provided id #${id} has been deleted`,
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
