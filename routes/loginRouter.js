const express = require("express");
const router = express.Router();
const supabase = require("../middleware/supabase.js")
const { redirectIfAuthenticated } = require("../middleware/auth.js");

router.get("/", redirectIfAuthenticated, (req, res) => {
  res.render("login/index", {
    activeForm: "loginForm",
    error: null,
    formData: {}
  });
});

// ─── Verify Email Page ────────────────────────────────────────────────────────
router.get("/verify-email", (req, res) => {
  const email = req.query.email || null;
  res.render("login/verify-email", { email });
});

// ─── Resend Verification Email ────────────────────────────────────────────────
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.redirect("/login/verify-email?error=missing-email");
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    console.error("Resend verification error:", error);
    // Redirect back with the email preserved — client handles UI feedback
    return res.redirect(`/login/verify-email?email=${encodeURIComponent(email)}&error=resend-failed`);
  }

  console.log("Verification email resent to:", email);
  res.redirect(`/login/verify-email?email=${encodeURIComponent(email)}&resent=true`);
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post("/loginAccount", async (req, res) => {
  try {
    const identifier = req.body.identifier;
    const password = req.body.password;
    let loginEmail = identifier;

    const isEmail = identifier.includes('@');

    if (!isEmail) {
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", identifier)
        .single();

      if (profileError || !userProfile || !userProfile.email) {
        return res.render("login/index", {
          error: "Invalid username or password",
          activeForm: "loginForm",
          formData: req.body
        });
      }

      loginEmail = userProfile.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (error) {
      console.error("Login error:", error);

      // If Supabase rejects because the email isn't confirmed yet, send them
      // back to the verify page rather than showing a generic error
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        return res.redirect(`/login/verify-email?email=${encodeURIComponent(loginEmail)}`);
      }

      return res.render("login/index", {
        error: "Invalid username or password",
        activeForm: "loginForm",
        formData: req.body
      });
    }

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

    console.log("Login successful:", data.user.email);
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

// ─── Sign Up ──────────────────────────────────────────────────────────────────
router.post("/createAccount", async (req, res) => {
  // Check username is not already taken
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

  // Redirect to the verify-email page, passing the email so it can be displayed
  res.redirect(`/login/verify-email?email=${encodeURIComponent(req.body.email_addr)}`);
});

module.exports = router;