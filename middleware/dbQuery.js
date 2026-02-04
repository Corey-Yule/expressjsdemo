const supabase = require('./supabase.js')
const { getUsername } = require('./auth.js')

async function getFriends(req) {
  const user = await getUsername(req)

  if (!user) { return }

  const { data, error } = await supabase
    .from('friends')
    .select('user, friend')
    .eq('accepted', 'TRUE')
    .or(`user.eq.${user}, friend.eq.${user}`)

  if (error) { throw error }

  return data 
}

async function acceptFriendReq(req) {
  const friend = await getUser(req.body.username)
  const user = await getUsername(req)

  if (!friend || !user) { return }

  const { data, error } = await supabase
    .from('friends')
    .update({ accepted: true })
    .match({ user: friend, friend: user })

  if (error) { throw error }
}

async function denyFriendReq(req) {
  const friend = await getUser(req.body.username)
  const user = await getUsername(req)

  if (!friend || !user) { return }

  const { data, error } = await supabase
    .from('friends')
    .delete()
    .match({ user: friend, friend: user })

  if (error) { throw error }
}

async function getFriendReqs(req) {
  const user = await getUsername(req)

  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('friend', user)
    .eq('accepted', 'FALSE')

  if (error) { throw error }

  return data
}

async function addFriend(req) {
  const friend = await getUser(req.body.username)
  const user = await getUsername(req)
  const curFriends = await areFriends(user, friend)

  if (!friend || !user) { return }

  console.log(curFriends)

  try {
    const { data, error } = await supabase
      .from('friends')
      .insert([
        { user: user, friend: friend }
      ])
  } catch (error) {
    console.error("unable to add friend")
  }
}

async function areFriends(user, friend) {
  if (!friend || !user) { return }

  const { data, error } = await supabase
    .from('friends')
    .select("*", { count: "exact", head: true })
    .or(`user.eq.${user}, friend.eq.${user}`)
    .or(`user.eq.${friend}, friend.eq.${friend}`)

  if (error) { throw error }

  return data
}

async function getUser(username) {
  const { data, error } = await supabase.from('profiles')
    .select('username')
    .eq('username', username)

  if (error) { throw error }

  return data[0].username
}

async function getNumUsers() {
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count;
}

module.exports = { getNumUsers, addFriend, getFriendReqs, acceptFriendReq, denyFriendReq, getFriends }
