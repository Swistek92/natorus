const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
// GLOBAL MIDDLEWERE
//security http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit request

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requrest from this Ip, please try again in an hour!',
});

app.use('/api', limiter);

//body parser reading data from body into req.body

app.use(express.json({ limit: '10kb' }));

// data sanitization againt nosql query injection

app.use(mongoSanitize());

//data sanitization against xss

app.use(xss());

// prevent paramet pollution

app.use(
  hpp({
    whiteList: [
      'duration',
      'ratingsAvrage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// serving static files
app.use(express.static(`${__dirname}/public`));

//test middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // if something is in next then means thats its a error

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//error handling middleware
app.use(globalErrorHandler);

//SERVER

module.exports = app;
