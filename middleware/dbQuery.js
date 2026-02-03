const supabase = require('./supabase.js')

async function addFriend(username) {
  const user = await getUser(username)

  console.log(user)
}

async function getUser(username) {
  const { data, error } = await supabase.from('profiles')
    .select('username')
    .eq('username', username)

  return data
}

async function getStats(username) {
  const { data, error } = await supabase.from('statistics')
    .select(`*`)
    .eq(`username`, username)

  if (error) {
    throw error
  }

  console.log(data)
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

module.exports = { getStats, getNumUsers, addFriend }
