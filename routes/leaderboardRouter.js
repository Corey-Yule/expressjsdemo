const express = require('express')
const router = express.Router()
const { getUID, checkAuth, authenticateUser } = require("../middleware/auth.js");

router.get('/', authenticateUser ,(req, res) => {
  res.render('leaderboard/index')
})

module.exports = router
