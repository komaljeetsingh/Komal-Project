const Listing = require("./models/listing");
const Review=require("./models/review.js");
const { Listingschema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect("/listings");
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=Listingschema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    } else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errormsg);
    } else{
        next();
    }
}

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect("/listings");
    }
    next();
}