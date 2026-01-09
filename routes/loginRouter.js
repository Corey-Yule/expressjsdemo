const express = require("express");
const router = express.Router();
const supabase = require("../middleware/supabase.js")
const { redirectIfAuthenticated } = require("../middleware/auth.js");

router.get("/",  redirectIfAuthenticated,(req, res) => {
  res.render("login/index", {
    activeForm: "loginForm", // Set default
    error: null,
    formData: {}
  });
});

router.post("/loginAccount", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: req.body.email_addr,
      password: req.body.password,
    });

    if (error) {
      console.error("Login error:", error);
      return res.render("login/index", {
        error: error.message,
        activeForm: "loginForm",
        formData: req.body
      });
    }

    // Store session tokens in HTTP-only cookies
    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only HTTPS in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("Login successful:", data.user.email);
    
    // Redirect to dashboard
    res.redirect("/"); 

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.render("login/index", {
      error: "An unexpected error occurred",
      activeForm: "loginForm",
      formData: req.body
    });
  }
});

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
  
  // set cookies for signup (auto-login after signup)
  if (data.session) {
    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }
  res.redirect("/"); //dashboard when we actually make it!!!
})

module.exports = router;