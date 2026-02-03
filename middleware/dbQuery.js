const supabase = require('./supabase.js')

async function getStats(username) {
  const { data, error } = await supabase.from('statistics')
    .select(`*`)
    .eq(`username`, username)

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

module.exports = { getStats, getNumUsers }
