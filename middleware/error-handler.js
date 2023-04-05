const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR ,
    msg: err.message || 'Something Went wrong Try again Later'
  }
  // Handling Validation Of Inputs Error while Registeration with Proper Respons [Validation Error]
  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors)
    .map((item)=> item.message)
    .join(',');
    customError.statusCode = 400;
  }
  if(err.name === 'CastError'){
    customError.msg = `No Job Found with JobId: ${err.value} Probably Searching with Incorrect JobId Syntax`
    customError.statusCode = 404;
  }
  // Handling Duplication of Mail Error while Registeration with Proper Response [Duplication Error]
  if(err.code && err.code===11000){
    customError.msg = `Duplicate Value Entered for ${Object.keys(err.keyValue)} field, Please Choose another Value`;
    customError.statusCode = 400;
  }   
  return res.status(customError.statusCode).json({ msg: customError.msg });
  return res.status(customError.statusCode).json({err});
}

module.exports = errorHandlerMiddleware
