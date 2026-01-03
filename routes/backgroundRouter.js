const express = require('express')
const router = express.Router()

router.get('/background', (req, res) => {
  res.render('background/backgroundFile')
})

module.exports = router