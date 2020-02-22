import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import moment from 'moment';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);

const tripRequestValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    type: Joi.string().valid('one way', 'return').required().error(() => ({
      message: 'Please provide a valid request type: [one way, return, multi city]'
    })),

    fromCountry: Joi.string().country().required().error(() => ({
      message: 'Please provide a valid from country: eg [KN, Rw, USA, UG, ...]'
    })),

    fromCity: Joi.string().required().error(() => ({
      message: 'Please provide a valid from city: eg [Kigali, kampala, ....]'
    })),

    toCountry: Joi.string().country().required().error(() => ({
      message: 'Please provide a valid to country: eg [USA, RW, UG, ...]'
    })),

    toCity: Joi.string().required().error(() => ({
      message: 'Please provide a valid from CITY: eg [Kigali, kampala, ....]'
    })),

    accommodation: Joi.string().valid('yes', 'no').required().error(() => ({
      message: 'Please provide a valid accommodation value: [yes, no]'
    })),

    departureDate: Joi.date().format('YYYY-MM-DD').error(() => ({
      message: 'Date format must be YYYY-MM-DD'
    })).min(moment().format('YYYY-MM-DD'))
      .required()
      .error(() => ({
        message: 'Please provide a valid departure date'
      })),

    returnDate: Joi.date().format('YYYY-MM-DD').error(() => ({
      message: 'Date format must be YYYY-MM-DD'
    })).when('type', {
      is: Joi.string().regex(/^return$/),
      then: Joi.date().min(Joi.ref('departureDate')).required()
        .error(() => ({
          message: `Please provide valid date for return, date must not be allowed than your departure date ${req.body.departureDate}`
        })),
      otherwise: Joi.date().max(0).error(() => ({
        message: 'Only provide a return date on a return trip request'
      })),
    }),

    reason: Joi.string().min(20).required().error(() => ({
      message: 'Please provide a reason (more than 20 char)'
    })),
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
