const express = require('express');
const router = express.Router({mergeParams: true});


const wrapAsync = require('../utils/wrapAsync.js');
const { reviewSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const reviewController = require('../controllers/reviews.js')
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");



const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
        next();
};


// Reviews Routes......................

// Post Review

router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;