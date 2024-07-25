"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var expressError = require('../utils/expressError');

var catchAsync = require('../utils/catchAsync');

var Campground = require('../models/campground');

var _require = require('../JoiSchemas'),
    campgroundSchema = _require.campgroundSchema;

var flash = require('connect-flash');

var _require2 = require('../middleware'),
    isLoggedIn = _require2.isLoggedIn,
    storeReturnTo = _require2.storeReturnTo;

var mongoose = require('mongoose');

var validateCampground = function validateCampground(req, res, next) {
  var _campgroundSchema$val = campgroundSchema.validate(req.body),
      error = _campgroundSchema$val.error;

  if (error) {
    var msg = error.details.map(function (er) {
      return er.message;
    }).join(',');
    throw new expressError(msg, 400);
  } else {
    next();
  } // console.log(error)

};

router.get('/', catchAsync(function _callee(req, res) {
  var campgrounds;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Campground.find({}));

        case 2:
          campgrounds = _context.sent;
          res.render('campgrounds/index', {
            campgrounds: campgrounds
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}));
router.get('/new', isLoggedIn, function (req, res) {
  // if (!req.isAuthenticated) {
  //     req.flash('error','you must be signed in!')
  //     res.redirect('/login')
  // }
  res.render('campgrounds/new');
});
router.post('/', isLoggedIn, validateCampground, catchAsync(function _callee2(req, res, next) {
  var campground;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // if(!req.body.campground) throw new expressError("Invalid campground data",404)
          // const campground = new Campground(req.body.campground)
          campground = new Campground(req.body.campground);
          _context2.next = 3;
          return regeneratorRuntime.awrap(campground.save());

        case 3:
          // res.send(req.body.campground)
          req.flash('success', 'Successfully made a new campground!');
          res.redirect("campgrounds/".concat(campground._id));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}));
router.get('/:id', catchAsync(function _callee3(req, res) {
  var campground;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id).populate('reviews'));

        case 2:
          campground = _context3.sent;

          if (campground) {
            _context3.next = 6;
            break;
          }

          req.flash('error', 'Cannot find that campground!');
          return _context3.abrupt("return", res.redirect('/campgrounds'));

        case 6:
          res.render('campgrounds/show', {
            campground: campground
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}));
router.get('/:id/edit', isLoggedIn, catchAsync(function _callee4(req, res, next) {
  var campground;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(mongoose.Types.ObjectId.isValid(req.params.id));

        case 2:
          campground = _context4.sent;

          if (campground) {
            _context4.next = 6;
            break;
          }

          req.flash('error', 'Cannot find that campground!');
          return _context4.abrupt("return", res.redirect('/campgrounds'));

        case 6:
          res.render('campgrounds/edit', {
            campground: campground
          });

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
}));
router.put('/:id', isLoggedIn, validateCampground, catchAsync(function _callee5(req, res, next) {
  var id, campground;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndUpdate(id, _objectSpread({}, req.body.campground)));

        case 3:
          campground = _context5.sent;
          // updateCG.save();
          req.flash('success', 'Successfully updated a campground!');
          res.redirect("/campgrounds/".concat(campground._id));

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
}));
router["delete"]('/:id', isLoggedIn, catchAsync(function _callee6(req, res, next) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndDelete(id));

        case 3:
          req.flash('success', 'Successfully deleted a campground!');
          res.redirect('/campgrounds');

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
}));
module.exports = router;