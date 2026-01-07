const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const supabase = require("../middleware/supabase.js")

router.get("/", (req, res) => {
  res.render("login/index");
});

router.post("/loginAccount", (req, res) => {
  supabase.auth.signInWithPassword({
    email: req.body.email_addr,
    password: req.body.password,
})

  res.render("index")
})

router.post("/createAccount", (req, res) => {
  supabase.auth.signUp({
    email: req.body.email_addr,
    password: req.body.password,
  })
  .then(({ data, error }) => {
    if (error) {
      console.error("Signup error:", error);
      // Handle error
    } else {
      console.log("Signup successful:", data);
      // Handle success
    }
  })
  .catch((err) => {
    console.error("Unexpected error:", err);
    // Handles special poeople
  });

  res.render("index")
})

module.exports = router;
