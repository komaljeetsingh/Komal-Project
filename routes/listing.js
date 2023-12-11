const express = require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, validateListing}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn, upload.single("list[image]"), validateListing, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm))

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner, isLoggedIn, upload.single("list[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isOwner, isLoggedIn, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm))

router.post("/search", wrapAsync(listingController.searchListing));

module.exports=router;