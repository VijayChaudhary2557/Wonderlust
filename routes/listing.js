const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require('../controllers/listings.js');

// form file data 
const {storage} = require("../cloudConfig.js");
const multer = require('multer');
const upload = multer({storage});




const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
        next();
};

// New Method to write routes........

// router.route('/')
// .get(wrapAsync(listingController.index))
// .post(validateListing, isLoggedIn, wrapAsync(listingController.createListing));


router.get('/', wrapAsync(listingController.index));

// New Route

router.get('/new', isLoggedIn, listingController.renderNewForm);


// Show Route

router.get('/:id', wrapAsync(listingController.showListing));

// Create Route

router.post('/',  upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// router.post('/', upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// });

// Edit Route

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route

router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

// Destroy Route

router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;