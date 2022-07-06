const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // console.log(err);
  // const regex = new Regex('[^"]*');

  const value = Object.values(err.keyValue)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handlerJWTError = () =>
  new AppError('invalid token please log in again', 401);

const expiredJWTError = () =>
  new AppError('token was expired, please login again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    stuts: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  // operational trusted error, send msg to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      stuts: err.status,
      message: err.message,
    });
    // programming or other uknow errror dont wanna leak error details
  } else {
    //1.log error

    console.error('Error 💥', err);
    //2 send genergic msg
    res.status(500).json({
      status: 'error',
      message: 'something went wrong 💥',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error._message === 'Validation failed') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handlerJWTError(error);
    }
    if (error.name === 'TokenExpiredError') {
      error = expiredJWTError(error);
    }
    sendErrProd(error, res);
  }
};
