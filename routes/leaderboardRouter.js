const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { getUID, checkAuth, authenticateUser } = require("../middleware/auth.js");

router.get('/', authenticateUser, async (req, res) => {
  try {
    // Fetch the top 10 players ordered by missions_complete descending (Im winning)
    const { data: leaderboardData, error } = await supabase
      .from('mission_completions')
      .select('level, username, missions_complete')
      .order('missions_complete', { ascending: false })
      .limit(10); 

    if (error) {
      console.error('Supabase error fetching leaderboard:', error);
    }

    // Format the data (so it matches the front end cause I love life)
    const formattedData = (leaderboardData || []).map(player => ({
        level: player.level || 0,
        username: player.username || 'Unknown Player',
        missions: player.missions_complete || 0
    }));

    // Pass the real data to the EJS template
    res.render('leaderboard/index', { leaderboardData: formattedData });

  } catch (err) {
    console.error("Server error loading leaderboard:", err);
    res.render('leaderboard/index', { leaderboardData: [] }); // Fallback empty array
  }
})

module.exports = router;