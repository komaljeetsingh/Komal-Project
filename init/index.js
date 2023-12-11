const mongoose=require("mongoose");
const listdata=require("./data.js");
const Listing=require("../models/listing.js");

const con=async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};
con().then(()=>{
    console.log("Connection Successful");
});
con().catch(()=>{
    console.log("Error");
});

const initDB=async()=>{
    await Listing.deleteMany({});
    listdata.data=listdata.data.map((obj)=>({...obj, owner: "656c5324a3fe3099c1e4761c"}));
    await Listing.insertMany(listdata.data);
};

initDB();
