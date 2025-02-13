/* 
    INSTRUCTION: setup genre controller functions here
    - getGenres: get all genres
    - createGenre: create a new genre
    - updateGenre: update a genre
    - deleteGenre: delete a genre
*/

const Genre = require("../models/genre");

const getGenres = async () => {
  const genres = await Genre.find();
  return genres;
};

const addNewGenre = async (name) => {
  const newGenre = new Genre({
    name,
  });
  await newGenre.save();
  return newGenre;
};

const updateGenre = async (_id, name) => {
  const updatedGenre = await Genre.findOneAndUpdate(
    { _id },
    { name },
    { new: true }
  );
  return updatedGenre;
};

const deleteGenre = async (_id) => {
  return await Genre.findOneAndDelete({ _id });
};


//export
module.exports = {
  getGenres,
  addNewGenre,
  updateGenre,
  deleteGenre
};
