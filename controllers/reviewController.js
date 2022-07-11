// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
const Reviev = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};

exports.getReview = factory.getOne(Reviev);

exports.getAllRevievw = factory.getAll(Reviev);
exports.createReviev = factory.createOne(Reviev);
exports.updateReview = factory.updateOne(Reviev);

exports.deleteReview = factory.deleteOne(Reviev);
