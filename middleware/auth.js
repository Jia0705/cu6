/* 
    INSTRUCTION: setup authentication middleware here
    - isStaff: check if the user is a valid staff or admin
    - isAdmin: check if the user is an admin
*/
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../controllers/auth");

// to check if the user is a valid staff or admin
const isValidStaff = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // get the user data by email
    const user = await getUserByEmail(decoded.email);

    // if user exists
    if (user) {
      // add user data into request
      req.user = user;
      // trigger the next function
      next();
    } else {
      res.status(403).send({ error: "YOU SHALL NOT PASSSSS!!!!!" });
    }
  } catch (error) {
    res.status(400).send({
      error: "YOU SHALL NOT PASSSSS!!!!!",
    });
  }
};

// to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // get the user data by email
    const user = await getUserByEmail(decoded.email);

    // if user exists
    if (user && user.role === 'admin') {
      // trigger the next function
      next();
    } else {
      res.status(403).send({ error: "YOU SHALL NOT PASSSSS!!!!!" });
    }
  } catch (error) {
    res.status(400).send({
      error: "YOU SHALL NOT PASSSSS!!!!!",
    });
  }
};

module.exports = {
  isValidStaff,
  isAdmin,
};
