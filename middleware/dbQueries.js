const supabase = require('./supabase.js')

const queries = {
  getFriends: (user) => {
    return supabase
      .from('friends')
      .select('user, friend')
      .eq('accepted', 'TRUE')
      .or(`user.eq.${user}, friend.eq.${user}`)
  }, 

  acceptRequest: (user, friend) => {
    return supabase
      .from('friends')
      .update({ accepted: true })
      .match({ user: friend, friend: user })
  }, 

  denyRequest: (user, friend) => {
    return supabase
      .from('friends')
      .delete()
      .match({ user: friend, friend: user })
  },

  getFriendReqs: (user) => {
    return supabase
      .from('friends')
      .select('*')
      .eq('friend', user)
      .eq('accepted', 'FALSE')
  },

  addFriend: (user, friend) => {
    return supabase
      .from('friends')
      .insert([ { user: user, friend: friend } ])
  },

  areFriends: (user, friend) => {
    return supabase
      .from('friends')
      .select("*", { count: "exact", head: true })
      .or(`user.eq.${user}, friend.eq.${user}`)
      .or(`user.eq.${friend}, friend.eq.${friend}`)
  },

  getUser: (user) => {
    return supabase
      .from('profiles')
      .select('username')
      .eq('username', user)
      .limit(1)
  },


}

module.exports = { queries }
