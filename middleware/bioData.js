const supabase = require("../middleware/supabase.js")

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
  // 1. Get calendar week start/end (Keep this for your weekly summary query)
  const { start: calendarStart } = getWeekRange();

  // 2. Calculate the rolling 7-day range for your charts
  const today = new Date();
  const rollingStartObj = new Date(today);
  rollingStartObj.setDate(today.getDate() - 6);
  
  const rollingStart = rollingStartObj.toLocaleDateString('en-CA'); // e.g. "2026-03-11"
  const rollingEnd = today.toLocaleDateString('en-CA');           // e.g. "2026-03-17"
  const todayStr = rollingEnd;

  const [{ data: dailyData, error: e1 }, { data: weeklyData, error: e2 }] = await Promise.all([
    supabase.from('health_daily_logs')
      .select('calories, sleep_hours, log_date, water_intake, step_count, weight')
      .eq('user_id', uid)
      .gte('log_date', rollingStart) // <-- Fetch rolling 7 days
      .lte('log_date', rollingEnd)
      .order('log_date', { ascending: true }),

    supabase.from('health_weekly_summary')
      .select('calories_sum, sleep_hours_avg, sleep_hours_sum, days_logged, steps_sum, water_sum')
      .eq('user_id', uid)
      .eq('week_start', calendarStart) // <-- Safe to keep as calendar start
      .maybeSingle()
  ]);

  if (e1 || e2) console.error('Supabase error:', e1 || e2);

  const rows = dailyData ?? [];
  const weekly = weeklyData ?? {};

  // 3. Generate an array of the exact 7 date strings (YYYY-MM-DD) we want
  const last7Dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Dates.push(d.toLocaleDateString('en-CA'));
  }

  // 4. Map the DB rows to those exact 7 dates. If a day is missing, insert `null`.
  const cals = last7Dates.map(dateStr => {
    const row = rows.find(r => r.log_date === dateStr);
    return row ? row.calories : null;
  });

  const sleep = last7Dates.map(dateStr => {
    const row = rows.find(r => r.log_date === dateStr);
    return row ? row.sleep_hours : null;
  });

  // Find today's row specifically for the stat cards
  const todayRow = rows.find(row => row.log_date === todayStr) ?? {};

  return { cals, sleep, weekly, today: todayRow }
}

module.exports = { getBioData }
