import { body, validationResult } from 'express-validator';
import Models from '../database/models';
import i18n from '../utils/international';

const { Users } = Models;
const checkFirstName = [body('firstName')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('FirstNameRequired')}`)
  .bail()
  .isAlpha()
  .withMessage(`${i18n.__('FirstNameOnlyLetters')}`)
];
const checkLastName = [body('lastName').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('LastNameRequired')}`)
  .bail()
  .isAlpha()
  .withMessage(`${i18n.__('LastNameOnlyLetters')}`)
];
const checkValidEmail = [body('email')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('Emailrequired')}`)
  .bail()
  .isEmail()
  .withMessage(`${i18n.__('EmailValid')}`)];
const checkExistingEmail = [body('email', `${i18n.__('EmailTaken')}`)
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

const checkRoles = [body('role')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('The role is required')
  .matches('^travel_administrator$|^travel_team_member$|^manager$|^requester$')
  .withMessage('The user role must be one of these roles: travel_administrator, travel_team_member, manager, requester')];

const checkPassword = [body('password').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('PasswordRequired')}`)
  .bail()
  .isAlphanumeric()
  .withMessage(`${i18n.__('AlphaPasswordOnly')}`)
  .isLength({ min: 8 })
  .withMessage(`${i18n.__('PasswordMoreThan8')}`)];
const checkGender = [body('gender').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('GenderRequired')}`)
  .bail()
  .isAlpha()
  .isIn(['Male', 'M', 'm', 'male', 'F', 'f', 'Female', 'female'])
  .withMessage(`${i18n.__('GenderInvalid')}`)];
const checkDate = [body('birthDate').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('BirthDateRequired')}`)
];
const checkCurrency = [body('preferedCurrency').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('CurrencyRequired')}`)
  .bail()
  .isAlpha()];
const checkLocale = [body('preferedLang').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('LangRequired')}`)
  .bail()
  .isAlpha()
  .isIn(['fr', 'en'])
  .withMessage(`${i18n.__('LangInvalid')}`)];
const checkResidence = [body('residence').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('ResidenceRequired')}`)
  .bail()
  .isAlpha()];
const checkDepartment = [body('department').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('departmentRequired')}`)
  .bail()
  .isAlpha()];
const checkMangerEmail = [body('managerEmail')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('Emailrequired')}`)
  .bail()
  .isEmail()
  .withMessage(`${i18n.__('EmailValid')}`)];
const checkImageUrl = [body('imageUrl').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('ImageUrlRequired')}`)
  .bail()];
const checkBio = [body('bio').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('BioRequired')}`)
  .bail()];
const checkPassportNumber = [body('passportNumber').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${i18n.__('PassportRequired')}`)
  .bail()
  .isLength({ min: 9 })
  .withMessage(`${i18n.__('PassportNun9Chars')}`)
  .matches(/[a-zA-Z]{2}[0-9]{7}/)
  .withMessage(`${i18n.__('PassportNunInvalid')}`)];

const checkConfirmPassword = [body('confirmPassword').not().isEmpty({ ignore_whitespace: true })
  .withMessage('confirmPassword is required')
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

  if (errorMessageArr.includes(`${i18n.__('EmailTaken')}`)) {
    return res.status(409).json({
      status: 409,
      message: i18n.__('EmailExist'),
    });
  }
  return res.status(422).json({
    status: 422,
    message: errorMessageArr,
  });
};

export default {
  checkFirstName,
  checkLastName,
  checkValidEmail,
  checkExistingEmail,
  checkPassword,
  checkGender,
  checkDate,
  checkCurrency,
  checkLocale,
  checkResidence,
  checkDepartment,
  checkMangerEmail,
  checkImageUrl,
  checkBio,
  checkPassportNumber,
  checkRoles,
  checkConfirmPassword,
  validateResult
};
