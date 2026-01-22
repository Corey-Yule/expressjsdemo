const express = require('express')
const router = express.Router()
const {checkAuth} = require("../middleware/auth.js");

router.get("/callback", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/status", (req, res) => {
  const token = "sb-access-token";
  console.log(token)
  if (token) {
    return res.json({ loggedIn: true });
  }

  res.json({ loggedIn: false });
});

module.exports = router;
