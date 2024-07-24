"use strict";

var storeReturnTo = function storeReturnTo(req, res, next) {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }

  next();
};

var isLoggedIn = function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // add this line

    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }

  next();
};

module.exports = {
  storeReturnTo: storeReturnTo,
  isLoggedIn: isLoggedIn
};