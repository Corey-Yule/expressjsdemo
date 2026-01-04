const express = require('express')
const router = express.Router()
const supabase = require("../middleware/supabase.js")

async function getNames() {
  const { data, error } = await supabase
    .from('TestTable')
    .select()

  return data
}

router.get('/', (req, res) => {
  getNames().then(function(result) {
    console.log(result)
  })
})

module.exports = router
