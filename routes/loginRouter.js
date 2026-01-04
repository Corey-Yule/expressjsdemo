const express = require('express')
const router = express.Router()

router.get('/loginPage', (req, res) => {
  res.render('LoginPage/login')
})

module.exports = router