const express = require('express')
const router = express.Router()
const { getStats } = require('../middleware/dbQuery.js')

router.get('/', (req, res) => {
  res.render('test/index')
})

router.get('/htmx', (req, res) => {
  res.render('test/htmxTest')
})

router.post('/queryUser', (req, res) => {
  getStats(req.body.username)

  res.render('test/index')
})

module.exports = router
