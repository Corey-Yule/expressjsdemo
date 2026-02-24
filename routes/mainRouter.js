const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/auth.js");

router.get('/', async (req, res) => {
  const { authenticated } = await checkAuth(req)
  
  res.render('index', { authenticated })
});

module.exports = router