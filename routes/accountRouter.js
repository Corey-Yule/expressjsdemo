const express = require("express");
const router = express.Router();
const supabase = require("../middleware/supabase.js")
const { authenticateUser } = require("../middleware/auth.js");

// This route is protected - user must be logged in
// This route is protected - user must be logged in
router.get("/", authenticateUser, (req, res) => {
  // req.user is now available with all user data!
  console.log("Logged in user:", req.user.email);
  
  res.render("account/index", {
    user: req.user,
    username: req.user.user_metadata?.username
  });
});

router.post("/signOut", async (req, res) => {
  // Clear the authentication cookies
  res.clearCookie('sb-access-token');
  res.clearCookie('sb-refresh-token');

  // Redirect to login page
  res.redirect('/login');
});

//stuff
module.exports = router;