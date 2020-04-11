import CreateErrorHandler from '../creators/errorHandler';

export default CreateErrorHandler((error, req, res, next) => {
  if (error) {
    const errorData = error?.data ? error.data : 'Unexpected error';
    res.status(error?.status || 500).send({ ...error, data: errorData });
    return next();
  }
  return next();
});
