const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/auth");
/* 
    INSTRUCTION: setup the auth router here:
    - POST /login: Login a user
    - POST /signup: Sign up a new user
*/

// login route
router.post("/login", async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      // login user via login function
      const user = await login(email, password);
      // send back the user data
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send({
        error: error.message,
      });
    }
  });
  
  // sign up route
  router.post("/signup", async (req, res) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      // create new user via signup function
      const user = await signup(name, email, password);
      // send back the newly created user data
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send({
        error: error.message,
      });
    }
  });

module.exports = router;
