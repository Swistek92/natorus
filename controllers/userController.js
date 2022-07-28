const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
// destination: (req, file, cb) => {
// cb(null, 'public/img/users');
// },
// filename: (req, file, cb) => {
//user-12321313123adssad123-1231232131.jpeg
// user - uid       - time stemp
// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
// const ext = file.mimetype.split('/')[1];
// console.log(ext, 'ext');
// console.log(file.mimetype);
// cb(null, `user-${req.user.id}-${Date.now()}.${ext} `);
// cb(null, file.fieldname + '-' + uniqueSuffix);
// },
// });

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: 'public/img/users' });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  // console.log(req.file);
  // console.log(req.body);
  //1 create a error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('you can not update password by this route', 400));
  }
  //2 update user filltered with fields are allowed
  const filteredBody = filterObj(req.body, 'name', 'email');

  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

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
