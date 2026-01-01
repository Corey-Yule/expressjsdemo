const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.render('index')
})

const testRouter = require('./routes/testRouter.js')

app.use('/test', testRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

