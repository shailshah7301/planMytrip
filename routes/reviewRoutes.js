const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
//POST /tour/id of tour/reviews
//GET /tour/id of tour/reviews
//POST /reviews

router.route('/')
    .get(reviewController.getmanageReviews)
    .post(
        authController.protect, 
        authController.restrictTo('user', 'admin'), 
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(
        authController.protect,
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview);

module.exports = router;


