const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { getUID, checkAuth } = require("../middleware/auth.js");
const { getUser } = require("../middleware/dbQuery.js")

function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday...
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // roll back to Monday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

async function getBioData(uid) {
  const { start, end } = getWeekRange();
  const todayStr = new Date().toLocaleDateString('en-CA'); // gives YYYY-MM-DD in local time

  const [{ data: dailyData, error: e1 }, { data: weeklyData, error: e2 }] = await Promise.all([
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
      .maybeSingle()
  ]);

  if (e1 || e2) console.error('Supabase error:', e1 || e2);

  const rows  = dailyData ?? [];
  const cals  = rows.map(row => row.calories);
  const sleep = rows.map(row => row.sleep_hours);
  const weekly = weeklyData ?? {};

  // Find today's row specifically for the stat cards
  const todayRow = rows.find(row => row.log_date === todayStr) ?? {};
  console.log('todayStr:', todayStr);
  console.log('rows dates:', rows.map(r => r.log_date));
  console.log('todayRow:', todayRow);

  return { cals, sleep, weekly, today: todayRow }
}

router.get('/', async (req, res) => {
  checkAuth(req);
  const uid = await getUID(req);

  res.render('biomarker/index', await getBioData(uid));
});

router.post('/friend', async (req, res) => {
  const user = await getUser(req.body.username) 

  res.render('biomarker/index', await getBioData(user[0].id))
})

module.exports = router
