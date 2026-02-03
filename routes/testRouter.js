const express = require('express')
const router = express.Router()
const { addFriend } = require('../middleware/dbQuery.js')

router.get('/', (req, res) => {
  res.render('test/index')
})

router.get('/htmx', (req, res) => {
  res.render('test/htmxTest')
})

router.post('/addFriend', (req, res) => {
  addFriend(req.body.username)

  res.render('test/index')
})

module.exports = router
