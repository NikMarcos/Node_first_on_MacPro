const { db } = require('./config/config.js');
const {getUsers, getUserById} = require('./queries')
// Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Pool } = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const responseTime = require('response-time')
// const methodOverride = require('method-override');
// const axios = require('axios');
const client = require('redis').createClient();

client.on('connect', function() {
    console.log('connected');
});


 client.on('error', (err) => {
    console.log("Error " + err);
 });

//  client.hmset('index', 'title', 'My', 'name', 'Niks');
//  // client.get('string key', redis.print);
//  client.hgetall('index', function(err, object) {
//     console.log(object);
// });

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const userSignIn = require('./routes/sign_in');
const userSignUp = require('./routes/sign_up');
const images = require('./routes/images');

const app = express();

app.locals.client = client;

const pool = new Pool({
  user: db.user,
  host: db.host,
  database: db.name,
  password: db.password,
  port: db.port,
});

// app.use(methodOverride('_method'));
app.use(responseTime());
app.use(session({
  store: new pgSession({
    pool : pool,
    tableName : 'session'
  }),
  secret: 'I love nodejs',
  resave: false,
  saveUninitialized: false,
  // 30 days
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

// app.use('/', function (req, res, next) {
//   let lang;
//   let accept = accepts(req);
//   let browserLang = accept.language('ru');
//   //req.acceptsLanguages(lang [,'ru'])
//   if (browserLang == 'ru') {
//     lang = ru_lang;
//     app.locals.lang = lang;
//     next();
//   } else {
//     lang = en_lang;
//     app.locals.lang = lang;
//     next();
//   }
// });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', function (req, res, next) {
  res.locals.path = req.originalUrl;
  if (req.session.userName && req.session.userEmail) {
    res.locals.regstatus = 'true';
    next();
  } else {
    next();
  }
});

app.use('/users', function (req, res, next) {
  console.log("first");
  if (req.session.userName && req.session.userEmail) {
    next();
  } else if (req.originalUrl == '/sign_up') {
    res.redirect('/sign_up');
  } else {
    res.redirect('/sign_in');
  }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/sign_in', userSignIn);
app.use('/sign_up', userSignUp);
app.use('/sign_in/out', userSignIn);
app.use('/images', images);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
