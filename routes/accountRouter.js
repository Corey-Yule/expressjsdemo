const express = require("express");
const router = express.Router();
const supabase = require("../middleware/supabase.js")

router.get("/", (req, res) => {
  res.render("account/index")
});

//stuff
module.exports = router;