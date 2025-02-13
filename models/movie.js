const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  INSTRUCTION: setup the Movie model according to the following requirements:
    - title: (String, required)
    - director: (ObjectId, ref: 'Director', required)
    - genre: (ObjectId, ref: 'Genre', required)
    - releaseDate: (Date, required)
    - description: (String)
*/


const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: Schema.Types.ObjectId,
    ref: "Director",
    required: true,
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
});

const Movie = model("Movie", movieSchema);
module.exports = Movie;