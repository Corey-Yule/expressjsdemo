const express = require('express')
const router = express.Router()
const { checkAuth } = require("../middleware/auth.js");

router.get("/callback", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/status", (req, res) => {
  checkAuth(req).then(({ authenticated, user }) => {
    return authenticated ? res.json({ loggedIn: true}) : res.json({ loggedIn: false })
  })
});

module.exports = router;
