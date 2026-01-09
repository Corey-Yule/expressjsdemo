const { authenticateUser } = require("../middleware/auth.js");
//authenticateUser - Use on protected routes

// Forces login, provides req.user
router.get("/dashboard", authenticateUser, (req, res) => {
  res.render("dashboard", { user: req.user });
});

//redirectIfAuthenticated - Use on login/signup pages

// Prevents logged-in users from seeing login page
router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.render("login/index");
});

//checkAuth - Use for flexible routes (homepage, etc.)
// Show different content based on auth status
router.get("/", async (req, res) => {
  const auth = await checkAuth(req);
  
  // Update cookies if tokens were refreshed
  if (auth.newTokens) {
    res.cookie('sb-access-token', auth.newTokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie('sb-refresh-token', auth.newTokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }
  
  res.render("index", { 
    isAuthenticated: auth.authenticated,
    user: auth.user 
  });
});