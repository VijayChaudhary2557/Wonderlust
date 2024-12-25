const Listing = require('../models/listing')
const axios = require('axios') 


module.exports.index = async (req,res, next) => {
    let allListings = await Listing.find({});
    res.render('./listings/index.ejs', { allListings });
};

module.exports.renderNewForm = (req,res) => {  
    res.render('./listings/new.ejs');
};

module.exports.showListing = async (req,res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path: 'reviews', 
        populate: {
            path: "author",
        },
    })
    .populate('owner');
    if(!listing)
    {
        req.flash("error", "Listing You requested for does not exist");
        res.redirect("/listings");
    }
 

    res.render('./listings/show.ejs', {listing});
};

module.exports.createListing = async (req,res, next) => {
    let url = req.file.path
    let filename = req.file.filename
    let newListing = new Listing(req.body.listing);
    newListing.image = {url, filename}
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");     
};

module.exports.renderEditForm = async (req,res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error", "Listing You requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req,res, next) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    listing = await Listing.findById(id);
    req.flash("success", "Listing Edit Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res, next) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};