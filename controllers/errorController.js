const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: { ${key}: ${err.keyValue[key]} }. Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const keys = Object.keys(err.errors);
  let message = 'Invalid Input Data: ';
  keys.forEach((key, index) => {
    message += `${index + 1}) ${err.errors[key].message}. `;
  });
  return new AppError(message, 400);
};

const handleJwtError = (err) =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJwtExpiredError = (err) =>
  new AppError('Your token has expired! Please log in please', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      stack: err.stack,
      message: err.message,
    });
  }
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something Went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error('ERROR', err);
    return res.status(500).json({
      status: 'fail',
      message: 'Something Went Wrong',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something Went wrong',
      msg: err.message,
    });
  }

  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something Went wrong',
    msg: 'Something Went wrong! Please Try Again Later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if ((process.env.NODE_ENV || '').trim() === 'development') {
    sendErrorDev(err, req, res);
  } else if ((process.env.NODE_ENV || '').trim() === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJwtExpiredError(error);

    sendErrorProd(error, req, res);
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Something Went Wrong',
    });
  }
};
