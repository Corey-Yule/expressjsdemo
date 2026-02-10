const supabase = require('./supabase.js')

const queries = {
  getFriends: async (user) => {
    const { data, error } = await supabase
      .from('friends')
      .select('user, friend')
      .eq('accepted', 'TRUE')
      .or(`user.eq.${user}, friend.eq.${user}`)
  }, 

}

module.exports = { queries }
