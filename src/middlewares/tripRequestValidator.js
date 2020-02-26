import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import moment from 'moment';
import setLanguage from 'utils/international';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);

const tripRequestValidator = (req, res, next) => {
  const { preferedLang } = req.user;
  const schema = Joi.object().keys({
    type: Joi.string().valid('one way', 'return').required().error(() => ({
      message: setLanguage(preferedLang).__('validType')
    })),

    fromCountry: Joi.string().country().required().error(() => ({
      message: setLanguage(preferedLang).__('validFromCountry')
    })),

    fromCity: Joi.string().required().error(() => ({
      message: setLanguage(preferedLang).__('validFromCity')
    })),

    toCountry: Joi.string().country().required().error(() => ({
      message: setLanguage(preferedLang).__('validToCountry')
    })),

    toCity: Joi.string().required().error(() => ({
      message: setLanguage(preferedLang).__('validToCity')
    })),

    accommodation: Joi.string().valid('yes', 'no').required().error(() => ({
      message: setLanguage(preferedLang).__('validAccommodation')
    })),

    departureDate: Joi.date().format('YYYY-MM-DD').min(moment().format('YYYY-MM-DD'))
      .required()
      .error(() => ({
        message: setLanguage(preferedLang).__('validDepartureDate')
      })),

    returnDate: Joi.date().format('YYYY-MM-DD').when('type', {
      is: Joi.string().regex(/^return$/),
      then: Joi.date().min(Joi.ref('departureDate')).required()
        .error(() => ({
          message: `${setLanguage(preferedLang).__('validReturnOn')} ${req.body.departureDate}`
        })),
      otherwise: Joi.date().max(0).error(() => ({
        message: setLanguage(preferedLang).__('onlyReturn')
      })),
    }),

    reason: Joi.string().min(20).required().error(() => ({
      message: setLanguage(preferedLang).__('ValidReason')
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
