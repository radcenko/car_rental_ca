// Import necessary libraries and modules
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
require('./config/passport-setup')(passport);
const { run } = require('./utils/databaseService');

// // Database setup
const db = require('./models');

// Configure session store
const myStore = new SequelizeStore({
  db: db.sequelize
});

// Populate the database
run().then(() => {
console.log('Starting the server.');
});

var indexRouter = require('./routes/index');
var vehiclesRouter = require('./routes/vehicles');
var coloursRouter = require('./routes/colours');
var typesRouter = require('./routes/types');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
  secret: 'your secret',
  store: myStore,
  resave: false,
  saveUninitialized: false,
  proxy: true
}));

myStore.sync();

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Add a function to fetch the user data
function getUser(req) {
  if (req && req.user) {
    return req.user;
  } else {
    // Return null if user data is not available
    return null;
  }
}

app.use((req, res, next) => {
  // Fetch or set the user data here and make it available in res.locals
  const user = getUser(req);
  res.locals.user = user;
  next();
});

app.use('/', indexRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/colours', coloursRouter);
app.use('/types', typesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;