/**
 * @description A function that will handle success responses
 * @param {object} res
 * @param {integer} statusCode
 * @param {string} message
 * @param {object} data
 * @returns {object} Success response
 */
export const successResponse = (res, statusCode, message, data = null) => res.status(statusCode)
  .json(
    data ? {
      status: statusCode,
      message,
      data
    } : {
      status: statusCode,
      message
    }
  );

/**
 * @description A function that will handle eerror responses
 * @param {object} res
 * @param {integer} statusCode
 * @param {string} error
 * @returns {object} Error response
 */
export const errorResponse = (res, statusCode, error) => res.status(statusCode).json({
  status: statusCode,
  error
});
