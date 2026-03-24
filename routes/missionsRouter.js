const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { getUID, checkAuth, authenticateUser } = require("../middleware/auth.js");
const { getBioData } = require("../middleware/bioData.js")

router.get('/', authenticateUser, async (req, res) => {
  checkAuth(req);
  const uid = await getUID(req);

  try {
    const newMissions = await createUserMissions(uid)
    const curMissions = await getUserMissions(uid)
    const completedMissions = await checkMissionCompletion(uid, curMissions)

    res.render('missions/index', { missions: completedMissions ?? [] });

  } catch (err) {
    console.error("Missions route error:", err.message);
    res.status(500).send("Error loading missions");
  }
});

router.post('/completed/:id', authenticateUser, async (req, res) =>  {
  checkAuth(req)
  const uid = await getUID(req)

  try {
    const deletedMissions = await deleteCompletedMission(req)
    const updatedMissions = await incrementCompletedMissions(uid)
  } catch (err) {
    console.error("Missions completed error:", err.message)
    res.status(500).send("Error completing mission")
  }

  res.redirect('/missions')
})

// ── Helpers ────────────────────────────────────────────────────────────────

async function deleteCompletedMission(req) {
  const { data, error } = await supabase 
    .from('current_missions')
    .delete()
    .eq('id', req.params.id)

  if (error) throw new Error(`deleteCompletedMissions: ${error.message}`)
}

async function incrementCompletedMissions(uid) {
  const { data: [ { missions_complete: completedMissions } ], error: completionsErr } = await supabase
    .from('mission_completions')
    .select('missions_complete')
    .eq('player_uuid', uid)

  if (completionsErr) throw new Error(`incrementCompletedMissions: ${completionsErr.message}`)

  const { data: updatedMissions, error: updateErr } = await supabase
    .from('mission_completions')
    .update({ missions_complete: completedMissions + 1 })
    .eq('player_uuid', uid)

  if (updateErr) throw new Error(`incrementCompletedMissions: ${updateErr.message}`)
}

async function checkCurMissions(uid) {
  const { data, error } = await supabase
    .from('current_missions')
    .select('*')
    .eq('user', uid);

  if (error) throw new Error(`checkCurMissions: ${error.message}`);
  return data ?? [];
}

async function generateAndStoreMissions(uid, type) {
  const { data: pool, error: fetchError } = await supabase
    .from('missions')
    .select('id')
    .eq('type', type);

  if (fetchError) throw new Error(`generateMissions fetch: ${fetchError.message}`);
  if (!pool || pool.length < 3) throw new Error(`Not enough ${type} missions in pool`);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const chosen   = shuffled.slice(0, 3);

  // Set deletion_date based on type
  const deletionDate = new Date();
  if (type === 'DAILY') {
    deletionDate.setDate(deletionDate.getDate() + 1); // expires tomorrow
  } else if (type === 'WEEKLY') {
    deletionDate.setDate(deletionDate.getDate() + 7); // expires in 7 days
  }
  const formattedDate = deletionDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const rows = chosen.map(m => ({
    user:          uid,           
    mission:       m.id,          
    deletion_date: formattedDate,
  }));

  const { error: insertError } = await supabase
    .from('current_missions')
    .insert(rows);

  if (insertError) throw new Error(`generateMissions insert: ${insertError.message}`);
}

async function createUserMissions(uid) {
  // Join current_missions with missions table to determine types present
  const { data: joinedMissions, error: joinError } = await supabase
    .from('current_missions')
    .select('mission, deletion_date, missions(id, type)')
    .eq('user', uid);

  if (joinError) throw new Error(joinError.message);

  const hasDaily  = joinedMissions?.some(m => m.missions?.type === 'DAILY');
  const hasWeekly = joinedMissions?.some(m => m.missions?.type === 'WEEKLY');

  if (!hasWeekly) await generateAndStoreMissions(uid, 'WEEKLY');
  if (!hasDaily)  await generateAndStoreMissions(uid, 'DAILY');
}

async function getUserMissions(uid) {
  // Re-fetch with full mission details for the view
  const { data: missions, error: refetchError } = await supabase
    .from('current_missions')
    .select('id, deletion_date, missions(id, type, description, completion_type, completion_requirement)') 
    .eq('user', uid);

  if (refetchError) throw new Error(refetchError.message);

  return missions
}

async function checkMissionCompletion(uid, curMissions) {
    const { weekly, today } = await getBioData(uid)

    for ({ missions } of curMissions) {
      switch (missions.type) {
        case "DAILY":
          switch (missions.completion_type) {
            case "STEPS":
              if (missions.completion_requirement <= today.step_count) { Object.assign(missions, { completed: true }) }
              break;

            case "SLEEP":
              if (missions.completion_requirement <= today.sleep_hours) { Object.assign(missions, { completed: true }) }
              break;

            case "WATER":
              if (missions.completion_requirement <= today.water_intake) { Object.assign(missions, { completed: true }) }
              break;
          }
        break;

        case "WEEKLY":
          switch (missions.completion_type) {
            case "STEPS":
              if (missions.completion_requirement <= weekly.steps_sum) { Object.assign(missions, { completed: true }) }
              break;

            case "SLEEP":
              if (missions.completion_requirement <= weekly.sleep_hours_sum) { Object.assign(missions, { completed: true }) }
              break;

            case "WATER":
              if (missions.completion_requirement <= weekly.water_sum) { Object.assign(missions, { completed: true }) }
              break;
          }
        break;
     }
  }

  return curMissions
}

module.exports = router;
