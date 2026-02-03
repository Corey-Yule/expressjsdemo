const express = require('express')
const router = express.Router()
const { addFriend, getFriendReqs, acceptFriendReq, denyFriendReq, getFriends } = require('../middleware/dbQuery.js')
const { getSelf } = require('../middleware/auth.js')

router.get('/', async (req, res) => {
  const requests = await getFriendReqs(req)
  const friends = await getFriends(req)
  const username = await getSelf(req)

  res.render('test/index', { requests, friends, username })
})

router.get('/htmx', (req, res) => {
  res.render('test/htmxTest')
})

router.post('/addFriend', (req, res) => {
  addFriend(req)

  res.redirect('/test')
})

router.post('/acceptRequest', (req, res) => {
  acceptFriendReq(req)

  res.redirect('/test')
})

router.post('/denyRequest', (req, res) => {
  denyFriendReq(req)

  res.redirect('/test')
})

module.exports = router
