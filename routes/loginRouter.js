const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const supabase = require("../middleware/supabase.js")

async function insertUser(data) {
  const { err } = await supabase
    .from("Users")
    .insert(data)
}

async function getUser(email) {
  const { data, err } = await supabase
    .from("Users")
    .select()
    .eq("email_addr", email)

  return data
}


router.get("/", (req, res) => {
  res.render("login/index");
});

router.post("/loginAccount", (req, res) => {
  getUser(req.body.email_addr).then(function(result) {
    if (!Object.hasOwn(result, 0)) { return }

    bcrypt.compare(req.body.password, result[0].password, (err, equal) => {
      if (err) {
        throw err
      } else {
        equal ? console.log("correct") : console.log("incorrect")
      }
    })
  })

  res.render("index")
})

router.post("/createAccount", (req, res) => {
  getUser(req.body.email_addr).then(function(result) {
    if (Object.hasOwn(result, 0)) { return }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        throw err;
      } else {
        req.body.password = hash
        insertUser(req.body)
      }
    })
  })

  res.render("index")
})

module.exports = router;
