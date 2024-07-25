const express = require('express');
const router = express.Router()
const expressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../JoiSchemas')
const flash = require('connect-flash')
const {isLoggedIn,storeReturnTo} = require('../middleware')
const mongoose = require('mongoose');

const validateCampground = (req,res,next) => {
    
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(er => er.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
    // console.log(error)
}

router.get('/',catchAsync(async(req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new',isLoggedIn,(req,res) => {
    // if (!req.isAuthenticated) {
    //     req.flash('error','you must be signed in!')
    //     res.redirect('/login')
    // }
    res.render('campgrounds/new')
})

router.post('/',isLoggedIn,validateCampground,catchAsync (async(req,res,next) => {
    // if(!req.body.campground) throw new expressError("Invalid campground data",404)
    // const campground = new Campground(req.body.campground)
    
    const campground = new Campground(req.body.campground)    
    await campground.save()
    // res.send(req.body.campground)
    req.flash('success','Successfully made a new campground!')
    res.redirect(`campgrounds/${campground._id}`)
    
}))

router.get('/:id',catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    // console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res,next) => {
    const campground = await mongoose.Types.ObjectId.isValid(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id',isLoggedIn,validateCampground,catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{... req.body.campground})
    // updateCG.save();
    req.flash('success','Successfully updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn,catchAsync(async(req,res,next)=>{
    const{id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted a campground!')
    res.redirect('/campgrounds')
}))

module.exports = router
