import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import moment from 'moment';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);

const multiCityValidator = (req, res, next) => {
  const trips = req.body;
  const schema = Joi.object().keys({
    type: Joi.string().valid('one way', 'return').required().error(() => ({
      message: 'type should not be empty. Only use the following values [one way, return, multi city] (Note: only one way trip requests allowed for now)'
    })),
    passportNumber: Joi.string().regex(/[a-zA-Z]{2}[0-9]{7}/).required(),
    gender: Joi.string().valid('male', 'other', 'female').required().error(() => ({
      message: 'gender should not be empty.Make sure that your gender is written in lowercase. example [male, other, female]'
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
    reason: Joi.string().min(10).required()
  });

  const errors = trips.map((item) => {
    let err;
    Joi.validate(item, schema, (error) => {
      if (error) {
        err = error.details.map((e) => (e.message));
      }
    });
    return err;
  }).filter((item) => item != null);
  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      error: errors
    });
  }

  req.body = trips;
  next();
};
export default multiCityValidator;
