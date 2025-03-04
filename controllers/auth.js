/* 
    INSTRUCTION: setup authentication related functions here
    - getUserByEmail: get user by email
    - login: login a user
    - signup: sign up a new user
    - generateJWTtoken: generate JWT token
*/


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// get user by email
async function getUserByEmail(email) {
  return await User.findOne({ email });
}

// generate JWT token
function generateJWTtoken(_id, name, email, role) {
  return jwt.sign(
    {
      _id,
      name,
      email,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    }
  );
}

const login = async (email, password) => {
  // check if email is exists in our system
  const user = await User.findOne({
    email,
  });
  // if not exist, throw an error
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // if exist, compare the password
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  // generate JWT token
  const token = generateJWTtoken(user._id, user.name, user.email, user.role);

  // password is correct, return the user data
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

const signup = async (name, email, password) => {
  // check if email already exists or not
  const emailExists = await User.findOne({
    email,
  });
  // if email exists in the collection
  if (emailExists) {
    throw new Error("Email already exists");
  }

  // create the new user
  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });

  // save the user data
  await newUser.save();

  // generate jwt token
  const token = generateJWTtoken(
    newUser._id,
    newUser.name,
    newUser.email,
    newUser.role
  );

  // return the user data
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token,
  };
};

module.exports = {
  login,
  signup,
  getUserByEmail,
};
