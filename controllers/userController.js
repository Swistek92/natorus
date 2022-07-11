const User = require('../models/userModel');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getUser = factory.getOne(User);
// do not update password with this!
exports.updateUser = factory.updateOne(User);
exports.getAllUsers = factory.getAll(User);

exports.deleteUser = factory.deleteOne(User);

const filterObj = (obj, ...allowedArguments) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedArguments.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'errror',
    message: 'this route is not yet build. Plase use /signup instad',
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1 create a error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('you can not update password by this route', 400));
  }
  //2 update user filltered with fields are allowed
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
