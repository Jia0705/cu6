/* 
    INSTRUCTION: setup director controller functions here
    - getDirectors: get all directors
    - getDirector: get a specific director
    - createDirector: create a new director
    - updateDirector: update a director
    - deleteDirector: delete a director
*/

const Director = require("../models/director");

const getDirectors = async () => {
  const directors = await Director.find();
  return directors;
};

const getDirector = async (id) => {
  const director = await Director.findOne({ _id: id });
  return director;
};

const addNewDirector = async (name, bio, contact, moviesDirected) => {
  const newDirector = new Director({
    name,
    bio,
    contact,
    moviesDirected,
  });
  await newDirector.save();
  return newDirector;
};

const updateDirector = async (_id, name, bio, contact, moviesDirected) => {
  const updatedDirector = await Director.findOneAndUpdate(
    { _id },
    { name, bio, contact, moviesDirected },
    { new: true }
  );
  return updatedDirector;
};

const deleteDirector = async (_id) => {
  const deleteDirector = await Director.deleteOne({ _id });
  return deleteDirector;
};

//export
module.exports = {
  getDirectors,
  getDirector,
  addNewDirector,
  updateDirector,
  deleteDirector,
};
