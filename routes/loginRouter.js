const express = require("express");
const router = express.Router();
const supabase = require("../middleware/supabase.js")

router.get("/", (req, res) => {
  res.render("login/index", {
    activeForm: "loginForm", // Set default
    error: null,
    formData: {}
  });
});

router.post("/loginAccount", (req, res) => {
  supabase.auth.signInWithPassword({
    email: req.body.email_addr,
    password: req.body.password,
  })

  res.render("index")
})

router.post("/createAccount", async (req, res) => {
  //Check if user exists and that the username is valid
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", req.body.username)
    .single();

  if (existingUser) {
    return res.render("login/index", {
      error: "Username already taken",
      activeForm: "signupForm", 
      formData: req.body
    });
  }

  //Create User
  const { data, error } = await supabase.auth.signUp({
    email: req.body.email_addr,
    password: req.body.password,
    options: {
      data: {
        username: req.body.username,
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return res.render("login/index", {
      error: error.message,
      activeForm: "signupForm", 
      formData: req.body
    });
  }

  console.log("Signup successful:", data);
  res.redirect("/"); //dashboard when we actually make it!!!
})

module.exports = router;