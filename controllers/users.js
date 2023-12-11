const User=require("../models/user");

module.exports.renderSignupForm=async(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.signUp=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registerUser=await User.register(newUser,password);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You are logged in");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin=async(req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Login Successfully");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}