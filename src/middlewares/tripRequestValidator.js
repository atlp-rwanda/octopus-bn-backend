import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import moment from 'moment';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);

const tripRequestValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    type: Joi.string().valid('one way', 'return').required().error(() => ({
      message: 'type should not be empty. Only use the following values [one way, return] (Note: only one way trip requests allowed for now)'
    })),
    passportNumber: Joi.string().regex(/[a-zA-Z]{2}[0-9]{7}/).required(),
    gender: Joi.string().valid('mole', 'other', 'female').required().error(() => ({
      message: 'gender should not be empty.Make sure that your gender is written in lowercase. example [mole, other, female]'
    })),
    fromCountry: Joi.string().country().required().error(() => ({
      message: 'fromCountry should not be empty. Please use country letter representations example [KN, Rw, USA, UG, ...]'
    })),
    fromCity: Joi.string().required(),
    accommodation: Joi.string().valid('yes', 'no').required().error(() => ({
      message: 'accommodation should not be empty.Please if you need accommodation enter [yes] if no enter [no]'
    })),
    toCountry: Joi.string().country().required(),
    toCity: Joi.string().required(),
    departureDate: Joi.date().format('YYYY-MM-DD').min(moment().format('YYYY-MM-DD')).required()
      .error(() => ({
        message: 'No trips to the past, date format must be YYYY-MM-DD'
      })),
    returnDate: Joi.date().format('YYYY-MM-DD').min(Joi.ref('departureDate')).when('type', { is: Joi.string().regex(/^return$/), then: Joi.required(), otherwise: Joi.date().max(0) })
      .error(() => ({
        message: 'Only provide a return date on a return trip request, Please provide valid date for return, date format must be YYYY-MM-DD'
      })),
    reason: Joi.string().min(10).required()
  });
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }
  return next();
};
export default tripRequestValidator;
