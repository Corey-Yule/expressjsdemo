const express = require('express')
const router = express.Router()
const { getQuery, addFriend, getFriendReqs, acceptFriendReq, denyFriendReq, getFriends } = require('../middleware/dbQuery.js')
const { getUsername, redirectIfNotAuthenticated } = require('../middleware/auth.js')

router.get('/', async (req, res) => {
  redirectIfNotAuthenticated(req, res)

  const requests = await getFriendReqs(req)
  const friends = await getFriends(req)
  const username = await getUsername(req)

  getQuery()

  if (username) { res.render('social/index', { requests, friends, username }) }
})

router.post('/addFriend', (req, res) => {
  addFriend(req)

  res.redirect('/social')
})

router.post('/acceptRequest', (req, res) => {
  acceptFriendReq(req)

  res.redirect('/social')
})

router.post('/denyRequest', (req, res) => {
  denyFriendReq(req)

  res.redirect('/social')
})

module.exports = router
