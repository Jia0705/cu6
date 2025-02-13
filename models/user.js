const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  INSTRUCTION: setup the User model according to the following requirements:
    - name: (String, required)
    - email: (String, required, unique)
    - password: (String, required)
    - role: (String, enum: ['staff', 'admin'], default: 'staff')
*/

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensure the email entered is unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["staff", "admin"],
    default: "staff",
  },
});

const User = model("User", userSchema);
module.exports = User;