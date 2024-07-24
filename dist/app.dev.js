"use strict";

var express = require('express');

var path = require('path');

var mongoose = require('mongoose');

var ejsMate = require('ejs-mate');

var session = require('express-session');

var flash = require('connect-flash');

var expressError = require('./utils/expressError');

var methodOverride = require('method-override');

var passport = require('passport');

var LocalStrategy = require('passport-local');

var User = require('./models/user');

var cookieparser = require('cookie-parser');

var userRoutes = require('./routes/users');

var campgrounds = require('./routes/campgrounds');

var reviews = require('./routes/reviews'); // const cookie = require('express-session/session/cookie')


mongoose.connect('mongodb://localhost:27017/yelp-camp').then(function () {
  console.log("Connection Successful!!!");
})["catch"](function (error) {
  console.log("Oh no error");
  console.log(error);
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});
var app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); // app.use(bodyParser.urlencoded({extended:true}))

app.use(express.urlencoded({
  extended: true
}));
app.use(cookieparser());
app.use(methodOverride('_method'));
app.use(express["static"](path.join(__dirname, 'public'))); // const sessionConfig = {
//     secret : 'bettersecret',
//     resave : false,
//     saveUnitialized : true,
//     cookie : {
//         httpOnly : true,
//         expires : Date.now()+1000*60*60*24*7,
//         maxAge : Date.now()+1000*60*60*24*7
//     }
// }

app.use(session({
  name: 'test',
  secret: 'bettersecret',
  resave: false,
  saveUnitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.success = req.flash("Success!");
  res.locals.error = req.flash('Error');
  next();
});
app.get('/fakeUser', function _callee(req, res) {
  var user, makeuser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = new User({
            email: 'abc@yahoo.com',
            username: 'firstuser'
          });
          _context.next = 3;
          return regeneratorRuntime.awrap(User.register(user, '1234'));

        case 3:
          makeuser = _context.sent;
          res.send(makeuser);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.use('/', userRoutes);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.get('/', function (req, res) {
  res.render('home');
});
app.all('*', function (req, res, next) {
  next(new expressError('Page not found!!', 404));
});
app.use(function (err, req, res, next) {
  var _err$statusCode = err.statusCode,
      statusCode = _err$statusCode === void 0 ? 500 : _err$statusCode,
      _err$message = err.message,
      message = _err$message === void 0 ? "Something went wrong" : _err$message; // res.send("Oh no it's an error")
  // res.render(err)

  if (!err.message) {
    err.message = "Oh no something went wrong!";
  }

  res.status(statusCode).render('error', {
    err: err
  });
});
app.listen(3000, function () {
  console.log("Serving port 3000!!!");
});