const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/* 
    INSTRUCTION: setup the Genre model according to the following requirements:
    - name: (String, required)
*/

const genreSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
  });
  
  const Genre = model("Genre", genreSchema);
  module.exports = Genre;