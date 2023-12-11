const express = require('express');
const wrapAsync=require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');
const router=express.Router();

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signUp));

router.route("/login")
.get(wrapAsync(userController.renderLogin))
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(userController.login))

router.get("/logout", wrapAsync(userController.logout))

module.exports=router;