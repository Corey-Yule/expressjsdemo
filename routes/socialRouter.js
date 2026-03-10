const express = require('express')
const router = express.Router()
const { getQuery, addFriend, getFriendReqs, acceptFriendReq, denyFriendReq, getFriends, deleteFriend } = require('../middleware/dbQuery.js')
const { getUsername, redirectIfNotAuthenticated } = require('../middleware/auth.js')

router.get('/', async (req, res) => {
  redirectIfNotAuthenticated(req, res)
  const requests = await getFriendReqs(req)
  const friends = await getFriends(req)
  const username = await getUsername(req)

  if (username) { res.render('social/index', { requests, friends, username }) }
})

router.post('/addFriend', async (req, res) => {
  await addFriend(req)

  res.redirect('/social')
})

router.post('/acceptRequest', async (req, res) => {
  await acceptFriendReq(req)

  res.redirect('/social')
})

router.post('/denyRequest', async (req, res) => {
  await denyFriendReq(req)

  res.redirect('/social')
})

router.post('/deleteFriend', async (req, res) => {
  await deleteFriend(req)

  res.redirect('/social')
})

module.exports = router
