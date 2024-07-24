const express = require('express');
const router = express.Router()
const User = require('../models/user');
const flash = require('connect-flash')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',async(req,res)=>{
    // res.send(req.body)
    try {
        const {email,username,password} = req.body
        const user = new User({email,username})
        const registeredUser = await User.register(user,password)
        console.log(registeredUser)
        req.flash("Welcome to yelpcamp!")
        res.redirect('/campgrounds')
    } 
    catch (error) {
        req.flash('error',error.message)
        res.redirect('register')
    }
    
})

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });

router.get('/logout',(req,res)=>{
    req.logout(function (err) {
    if (err) {
        return next(err);
    }
    })
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
})

module.exports = router