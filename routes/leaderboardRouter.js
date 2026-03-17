const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
// 1. Add checkAuth to your imports
const { getUID, authenticateUser, checkAuth } = require("../middleware/auth.js");

async function fetchLeaderboardData(req) {
  const uid = await getUID(req);
  
  const { data: leaderboardData, error } = await supabase
    .from('mission_completions')
    .select('level, username, missions_complete')
    .order('missions_complete', { ascending: false })
    .limit(10); 

  if (error) {
    console.error('Supabase error fetching leaderboard:', error);
    return []; 
  }

  const formattedData = (leaderboardData || []).map(player => ({
    level: player.level || 0,
    username: player.username || 'Unknown Player',
    missions: player.missions_complete || 0
  }));

  return formattedData;
}

router.get('/', authenticateUser, async (req, res) => {
  try {
    // 2. Call checkAuth to refresh/validate the session before querying
    checkAuth(req); 
    
    const formattedData = await fetchLeaderboardData(req);
    res.render('leaderboard/index', { leaderboardData: formattedData });

  } catch (err) {
    console.error("Server error loading leaderboard:", err);
    res.render('leaderboard/index', { leaderboardData: [] }); 
  }
});

module.exports = router;