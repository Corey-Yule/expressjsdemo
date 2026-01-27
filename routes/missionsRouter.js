const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('missions/index')
})

module.exports = router
