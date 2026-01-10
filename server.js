require("dotenv").config()
const express = require('express')
const cookieParser = require('cookie-parser'); // Cookies!!!!
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser()); // <----- NOTE: James this is where we are using cookie parsing 

app.get('/', (req, res) => {
  res.render('index')
});

const testRouter = require('./routes/testRouter.js')
const backgroundRouter = require('./routes/backgroundRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const databaseQuery = require('./routes/databaseQuery.js')
const authRouter = require('./routes/authRouter.js')
const accountRouter = require('./routes/accountRouter.js')

app.use('/test', testRouter);
app.use('/background', backgroundRouter); 
app.use('/login', loginRouter); 
app.use('/database', databaseQuery);
app.use('/auth', authRouter);
app.use('/account', accountRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});
