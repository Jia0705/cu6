/* 
    INSTRUCTION: setup movie controller functions here
    - getMovies: get all movies
    - getMovie: get a specific movie
    - createMovie: create a new movie
    - updateMovie: update a movie
    - deleteMovie: delete a movie
*/
const Movie = require("../models/movie");

const getMovies = async () => {
  const movies = await Movie.find()
  .populate("director")
  .populate("genre")
  return movies;
};

const getMovie = async (id) => {
  const movie = await Movie.findOne({ _id: id })
  .populate("director")
  .populate("genre")
  return movie;
};

const addNewMovie = async (
    title,
    director,
    genre,
    releaseDate,
    description
) => {
  const newMovie = new Movie({
    title,
    director,
    genre,
    releaseDate,
    description,
  });
  await newMovie.save();
  return newMovie;
};

const updateMovie = async (
  _id,
  title,
  director,
  genre,
  releaseDate,
  description
) => {
  const updatedMovie = await Movie.findOneAndUpdate(
    { _id },
    {
        title,
        director,
        genre,
        releaseDate,
        description
    },
    { new: true }
  );
  return updatedMovie;
};

const deleteMovie = async (_id) => {
  return await Movie.findOneAndDelete({ _id });
};


//export
module.exports = {
  getMovies,
  getMovie,
  addNewMovie,
  updateMovie,
  deleteMovie,
};