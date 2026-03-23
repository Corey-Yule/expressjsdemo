const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { getUID, checkAuth, authenticateUser } = require("../middleware/auth.js");

router.get('/', authenticateUser ,async (req, res) => {
  checkAuth(req);
  const uid = await getUID(req);


  //TODO: if checkCurMissions is empty generate daily and weekly missions. If checkCurMissions has weekly missions generate daily missions
  // when passing to the render, pass in a completed check so that the user can manually complete them
  // will get the supabase auto deletion done


  const missions = await generateMissions(uid, "DAILY")
  console.log(missions)


  res.render('missions/index')

  // // Fetch missions for the specific player
  // const { data: missions, error } = await supabase
  //   .from('mission_completions')
  //   .select('username, missions_complete')
  //   .eq('player_uuid', uid); // Match the column name in the DB
  //
  // if (error) {
  //   console.error("Supabase Error:", error.message);
  //   return res.status(500).send("Error fetching missions");
  // }
  //
  // const rows = missions ?? [];
  // 
  // // Extracting just the mission completion numbers/IDs
  // const missionList = rows.map(row => row.missions_complete);
  // 
  // console.log("Missions completed by user:", missionList);
  //
  // // Pass the data to the EJS view
  // res.render('missions/index', { 
  //   missions: rows,
  //   missionList: missionList 
  // });
})

async function checkCurMissions(uid) {
  const { data, error } = await supabase
    .from('current_missions')
    .select('*')
    .eq('user', uid)

  if (error) {
    console.error("Data fetching error", error.message)
    return res.status(500).send("Error fetching missions")
  }

  return data
}

async function generateMissions(uid, type) {
  let missionsToPush = []

  const { data, error } = await supabase
    .from('missions')
    .select('id')
    .eq('type', type)

  if (error) {
    console.error("Data fetching error", error.message)
    return res.status(500).send("Error fetching missions")
  }

  for (let i = 0; i < 3; i ++) {
    let ran = Math.floor(Math.random() * data.length)
    missionsToPush.push(data[ran])
    data.splice(ran, 1)
  }

  return missionsToPush
}

module.exports = router
 
