const Listing = require("../models/listing");

module.exports.index=async(req,res)=>{
    let data=await Listing.find({});
    res.render("./listings/index.ejs",{data});
}

module.exports.renderNewForm=async(req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{data});
}

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newlist=new Listing(req.body.list);
    newlist.owner=req.user._id;
    newlist.image={url, filename};
    await newlist.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/h_90,w_180");
    res.render("./listings/edit.ejs",{data, originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findByIdAndUpdate(id, {...req.body.list}, {runValidators: true, new: true});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        list.image={url, filename};
        await list.save();
    }
    req.flash("success","Listings Updated");
    res.redirect("/listings");
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
    }

module.exports.searchListing=async(req,res)=>{
    let list=await Listing.find(req.body);
    res.render("./listings/search.ejs",{list});
}        