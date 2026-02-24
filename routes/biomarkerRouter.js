const express = require("express");
const router = express.Router();
//const { getNumUsers } = require("../middleware/dbQuery.js"); //example

router.get('/', (req, res) => {
    res.render('biomarker/index', { users })

})



module.exports = router