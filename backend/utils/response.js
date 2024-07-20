class customError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorResponse = (err, res) => {
  console.log(err);
  console.log("------------------------------------------------------------");
  err.message = err.message || "INTERNAL SERVER ERROR";
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    name: err.name,
    code: err.code,
    success: false,
    message: err.message,
  });
};

export const successfulResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

export const validationErrorResponse = (res, errors) => {
  res.status(400).json({
    success: false,
    errors,
  });
}

export default customError;
