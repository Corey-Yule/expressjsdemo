const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
// 1. Import checkAuth (and getUID if you want to be perfectly consistent)
const { authenticateUser, checkAuth, getUID } = require("../middleware/auth.js");

function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); 
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); 
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

router.get('/', authenticateUser, async (req, res) => {
  try {
    // 2. AWAIT the checkAuth function to refresh the Supabase session token BEFORE querying!
    await checkAuth(req);

    // 3. I swapped this to getUID(req) to perfectly match your flawless biomarker router, 
    // ensuring we get the freshest verified ID rather than relying on a potentially stale req.user
    const uid = await getUID(req); 
    if (!uid) return res.redirect('/login');

    const { start, end } = getWeekRange();
    const todayStr = new Date().toLocaleDateString('en-CA'); 
    
    const [
        { data: dailyData, error: e1 }, 
        { data: weeklyData, error: e2 },
        { data: missionData, error: e3 }
      ] = await Promise.all([
        supabase.from('health_daily_logs')
          .select('calories, sleep_hours, log_date, water_intake, step_count, weight')
          .eq('user_id', uid)
          .gte('log_date', start)
          .lte('log_date', end)
          .order('log_date', { ascending: true }),

        supabase.from('health_weekly_summary')
          .select('calories_sum, sleep_hours_avg, sleep_hours_sum, days_logged')
          .eq('user_id', uid)
          .eq('week_start', start)
          .maybeSingle(),
          
        supabase.from('mission_completions')
          .select('missions_complete, level, username')
          .eq('player_uuid', uid) // Make sure 'player_uuid' is correct (your other tables use 'user_id')
          .maybeSingle()
    ]);

    // Isolate each error so I know exactly what failed
    if (e1) console.error('Supabase Daily Logs Error:', e1);
    if (e2) console.error('Supabase Weekly Summary Error:', e2);
    if (e3) {
        console.error('Supabase Mission Data Error for UID:', uid);
        console.error(e3);
    }

    const rows  = dailyData ?? [];
    const cals  = rows.map(row => row.calories);
    const sleep = rows.map(row => row.sleep_hours);
    const weekly = weeklyData ?? {};
    const todayRow = rows.find(row => row.log_date === todayStr) ?? {};

    if (!missionData && !e3) {
        console.warn(`No mission data found in DB for user: ${uid}`);
    }

    const missionsComplete = missionData?.missions_complete ?? 0;
    const level = missionData?.level ?? 1; 
    
    // Updated fallback since we swapped req.user for getUID
    const username = missionData?.username || 'Player'; 

    const missionsTowardsNextLevel = missionsComplete % 2; 
    const progressPercent = (missionsTowardsNextLevel / 2) * 100;

    const missionStats = {
        username: username,
        level: level,
        progressText: `${missionsTowardsNextLevel}/2 Missions`,
        progressPercent: progressPercent
    };

    res.render('home/index', { cals, sleep, weekly, today: todayRow, missionStats });

  } catch (err) {
    console.error("Server error loading home dashboard:", err);
    res.redirect('/login'); // Safe fallback if auth completely fails
  }
});

module.exports = router;