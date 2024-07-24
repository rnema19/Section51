"use strict";

var express = require('express');

var router = express.Router();

var User = require('../models/user');

var flash = require('connect-flash');

var catchAsync = require('../utils/catchAsync');

var passport = require('passport');

var _require = require('../middleware'),
    storeReturnTo = _require.storeReturnTo;

router.get('/register', function (req, res) {
  res.render('users/register');
});
router.post('/register', function _callee(req, res) {
  var _req$body, email, username, password, user, registeredUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, username = _req$body.username, password = _req$body.password;
          user = new User({
            email: email,
            username: username
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(User.register(user, password));

        case 5:
          registeredUser = _context.sent;
          console.log(registeredUser);
          req.flash("Welcome to yelpcamp!");
          res.redirect('/campgrounds');
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          req.flash('error', _context.t0.message);
          res.redirect('register');

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/login', function (req, res) {
  res.render('users/login');
});
router.post('/login', // use the storeReturnTo middleware to save the returnTo value from session to res.locals
storeReturnTo, // passport.authenticate logs the user in and clears req.session
passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login'
}), // Now we can use res.locals.returnTo to redirect the user after login
function (req, res) {
  req.flash('success', 'Welcome back!');
  var redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now

  res.redirect(redirectUrl);
});
router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds');
});
module.exports = router;