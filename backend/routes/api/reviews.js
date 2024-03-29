const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Sequelize } = require('sequelize')
const { Spot, User, ReviewImage, Review } = require('../../db/models');

const validateReview = [
    check("review")
      .exists({ checkFalsy: true })
      .withMessage("Review text is required"),
    check("stars")
      .exists({ checkFalsy: true })
      .withMessage("Stars must be an integer from 1 to 5").bail()
      .isInt({ min: 1, max: 5 })
      .withMessage("Stars must be an integer from 1 to 5"),
  
    handleValidationErrors,
  ];

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);

    if (!review) {
        const err = new Error('Review could not be found');
        err.status = 404;
        return next(err);
    };

    const newImage = await ReviewImage.create({
        reviewId,
        url: req.body.url
    })

    const {id, url} = newImage
    return res.json({ id, url });
});

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const Reviews = await Review.findAll({
        where: {
             userId
        },

     //Add User info below!!!--------   
        include: [
            {model: User},
            {model: Spot},
            {model: ReviewImage}
        ]
    //---------------------    
    });

    res.json({Reviews});
})

router.put('/:reviewId', validateReview, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { id, userId, spotId, review, stars } = req.body;

    const currentReview = await Review.findByPk(reviewId);

    if (!currentReview) {
        const err = new Error('Review could not be found');
        err.status = 404;
        return next(err)
        };

    currentReview.update({
        id, 
        userId,
        spotId,
        review,
        stars
    });

    res.json(currentReview);

});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const usersId = req.user.id;

    const doomedReview = await Review.findByPk(reviewId);

    if (!doomedReview) {
        const err = new Error('Review could not be found');
        err.status = 404;
        return next(err);
    };
    
    if (doomedReview.userId === usersId) {
        await doomedReview.destroy();
        return res.status(200).json({
            'message': 'Successfully deleted'
        });
    } else {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }
})



module.exports = router;