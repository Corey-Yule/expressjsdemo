const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")
const { getUID, checkAuth, authenticateUser } = require("../middleware/auth.js");
const { getUser } = require("../middleware/dbQuery.js")
const { getBioData } = require("../middleware/bioData.js")

router.get('/', authenticateUser , async (req, res) => {
  checkAuth(req);
  const uid = await getUID(req);
  const data = await getBioData(uid)

  res.render('biomarker/index', Object.assign(data, { isFriend: false }));
});

router.post('/friend', async (req, res) => {
  const user = await getUser(req.body.username) 
  const data = await getBioData(user[0].id)

  res.render('biomarker/index', Object.assign(data, { isFriend: true }))
})

// Route to handle saving new daily logs
router.post('/log', authenticateUser, async (req, res) => {
  checkAuth(req);
  const uid = await getUID(req);

  const { log_date, calories, step_count, sleep_hours, water_intake, weight } = req.body;

  const { data, error } = await supabase
    .from('health_daily_logs')
    .upsert({
      user_id: uid,
      log_date: log_date,
      calories: calories ? parseInt(calories) : null,
      step_count: step_count ? parseInt(step_count) : null,
      sleep_hours: sleep_hours ? parseFloat(sleep_hours) : null,
      water_intake: water_intake ? parseFloat(water_intake) : null,
      weight: weight ? parseFloat(weight) : null
    }, { 
      onConflict: 'user_id, log_date' 
    });

  if (error) {
    console.error('Error saving health log:', error);
  }

  // Redirect back to the dashboard
  res.redirect('/biomarker'); //please
});

module.exports = router
