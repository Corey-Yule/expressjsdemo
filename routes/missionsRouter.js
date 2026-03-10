const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { getUID, checkAuth, authenticateUser } = require("../middleware/auth.js");

router.get('/', authenticateUser ,async (req, res) => {
  checkAuth(req);
  const uid = await getUID(req);

  // Fetch missions for the specific player
  const { data: missions, error } = await supabase
    .from('mission_completions')
    .select('username, missions_complete')
    .eq('player_uuid', uid); // Match the column name in your DB

  if (error) {
    console.error("Supabase Error:", error.message);
    return res.status(500).send("Error fetching missions");
  }

  const rows = missions ?? [];
  
  // Extracting just the mission completion numbers/IDs
  const missionList = rows.map(row => row.missions_complete);
  
  console.log("Missions completed by user:", missionList);

  // Pass the data to your EJS/Pug view
  res.render('missions/index', { 
    missions: rows,
    missionList: missionList 
  });
})

module.exports = router
 