const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('test/index')
})

router.get('/htmx', (req, res) => {
  res.render('test/htmxTest')
})

module.exports = router
