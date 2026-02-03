const express = require("express");
const router = express.Router();
const { getNumUsers } = require("../middleware/dbQuery.js");

router.get('/', (req, res) => {
      getNumUsers().then((users) => {
      res.render('about/index', { users })
    })
})



module.exports = router