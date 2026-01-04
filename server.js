const express = require('express')
const app = express()
const port = 3000
<<<<<<< HEAD
//require("dotenv").config()
=======
>>>>>>> 29d66f461c1b062154c0b5bc23b0053d13a79b61

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.render('index')
})

const testRouter = require('./routes/testRouter.js')
const backgroundRouter = require('./routes/backgroundRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const databaseQuery = require('./routes/databaseQuery.js')

app.use('/test', testRouter);
app.use('/background', backgroundRouter); //Background
app.use('/LoginPage', loginRouter); //Login
app.use('/database', databaseQuery)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
