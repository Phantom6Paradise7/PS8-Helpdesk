const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered. An account with this email already exists.';
  }
  if (err.message && (err.message.includes('buffering timed out') || err.message.includes('serverSelectionTimeoutMS') || err.name === 'MongooseServerSelectionError')) {
    statusCode = 503;
    message = 'Database is currently unreachable. Please ensure MongoDB Atlas Network Access has 0.0.0.0/0 enabled and database credentials are valid.';
  }
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };