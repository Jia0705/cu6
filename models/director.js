const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  INSTRUCTION: setup the Director model according to the following requirements:
    - name: (String, required)
    - bio: (String)
    - contact: (String)
    - moviesDirected: (Number, default: 0)
*/


const directorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  contact: {
    type: String,
  },
  moviesDirected: {
    type: Number,
    default: 0,
  },
});

const Director = model("Director", directorSchema);
module.exports = Director;