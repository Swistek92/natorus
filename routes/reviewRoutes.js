const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// router.param('id', tourController.checkID);
// auth.protect => only for authenticate users
// authController.restrictTo('user') => only for users

router.use(authController.protect);
router.route('/').get(reviewController.getAllRevievw);
router
  .route('/')
  .post(reviewController.setTourUserIds, reviewController.createReviev);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
