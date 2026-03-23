const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { getUID, checkAuth, authenticateUser } = require("../middleware/auth.js");

router.get('/', authenticateUser, async (req, res) => {
  checkAuth(req);
  const uid = await getUID(req);

  try {
    const currentMissions = await checkCurMissions(uid);

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

    // Re-fetch with full mission details for the view
    const { data: missions, error: refetchError } = await supabase
      .from('current_missions')
      .select('id, deletion_date, missions(id, type, description)') 
      .eq('user', uid);

    if (refetchError) throw new Error(refetchError.message);

    res.render('missions/index', { missions: missions ?? [] });

  } catch (err) {
    console.error("Missions route error:", err.message);
    res.status(500).send("Error loading missions");
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────

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

module.exports = router;