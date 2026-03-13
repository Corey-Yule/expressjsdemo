const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { authenticateUser } = require("../middleware/auth.js");

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
  // 1. Grab the guaranteed UID from the middleware to prevent dropped connections
  const uid = req.user.id; 
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
      .eq('player_uuid', uid)
      .maybeSingle()
  ]);

  if (e1 || e2 || e3) console.error('Supabase error:', e1 || e2 || e3);

  const rows  = dailyData ?? [];
  const cals  = rows.map(row => row.calories);
  const sleep = rows.map(row => row.sleep_hours);
  const weekly = weeklyData ?? {};
  const todayRow = rows.find(row => row.log_date === todayStr) ?? {};

  const missionsComplete = missionData?.missions_complete ?? 0;
  //Check incase its being stupid
  const level = missionData?.level ?? 1; 
  
  const username = missionData?.username || req.user.user_metadata?.username || 'Player'; 

  // Calculate progress for the progress bar
  const missionsTowardsNextLevel = missionsComplete % 2; 
  const progressPercent = (missionsTowardsNextLevel / 2) * 100;

  const missionStats = {
      username: username,
      level: level,
      progressText: `${missionsTowardsNextLevel}/2 Missions`,
      progressPercent: progressPercent
  };

  res.render('home/index', { cals, sleep, weekly, today: todayRow, missionStats });
});

module.exports = router;