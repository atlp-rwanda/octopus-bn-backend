import { body, validationResult } from 'express-validator';
import Models from '../database/models';

const { Users } = Models;
const checkFirstName = [body('firstName')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('First name is required')
  .bail()
  .isAlpha()
  .withMessage('First name must only contain letters')
];

const checkLastName = [body('lastName').not().isEmpty({ ignore_whitespace: true })
  .withMessage('Last name is required')
  .bail()
  .isAlpha()
  .withMessage('Last name must only contain letters')
];

const checkValidEmail = [body('email')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('email is required')
  .bail()
  .isEmail()
  .withMessage('email should be valid')];

const checkExistingEmail = [body('email', 'email already taken')
  .custom((value = '') => Users.findOne({
    where: {
      email: value
    }
  }).then((user) => {
    if (user !== null) {
      return Promise.reject();
    }
    return true;
  }))];

const checkPassword = [body('password').not().isEmpty({ ignore_whitespace: true })
  .withMessage('Password is required')
  .bail()
  .isAlphanumeric()
  .withMessage('Password must be alphanumeric')
  .isLength({ min: 8 })
  .withMessage('password length must be longer than 8')];

/**
* @description this method validate user result
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} res
* @memberof validateArray
*/
const validateResult = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }
  const { errors } = result;

  const errorMessageArr = errors.map((el) => el.msg);

  if (errorMessageArr.includes('email already taken')) {
    return res.status(409).json({
      status: 409,
      message: 'email already taken',
    });
  }

  return res.status(422).json({
    status: 422,
    message: errorMessageArr,
  });
};

export default {
  checkFirstName, checkLastName, checkValidEmail, checkExistingEmail, checkPassword, validateResult
};
