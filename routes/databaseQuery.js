const express = require('express')
const router = express.Router()
const sql = require("../middleware/database.js")

async function getNames() {
  const names = await sql`
    SELECT
      *
    FROM
      TestTable
  `

  return names
}

router.get('/', (req, res) => {
  console.log(getNames())
})

module.exports = router
