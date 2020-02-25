import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import moment from 'moment';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);

export const validateMultiCity = (req, res, next) => {
  const schema = Joi.object().keys({
    type: Joi.string().valid('multi city').required().error(() => ({
      message: 'typeMustBeMulti'
    })),
    fromCountry: Joi.string().country().required().error(() => ({
      message: 'mFromCountry'
    })),
    fromCity: Joi.string().required(),
    toCountry: Joi.string().country().required(),
    toCity: Joi.string().required(),
    departureDate: Joi.date().format('YYYY-MM-DD').min(moment().format('YYYY-MM-DD')).required()
      .error(() => ({
        message: 'mDepDate'
      })),
    returnDate: Joi.date().format('YYYY-MM-DD').min(Joi.ref('departureDate'))
      .error(() => ({
        message: 'mRetDate'
      })),
    stops: Joi.required()
      .error(() => ({
        message: 'provideStops'
      })),
  });
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: req.i18n.__(error.details[0].message)
    });
  }
  return next();
};

export const validateStops = (req, res, next) => {
  const { stops } = req.body;
  const schema = Joi.object().keys({
    stopCountry: Joi.string().country().required().error(() => ({
      message: 'sCountry'
    })),
    stopCity: Joi.string().required(),
    accommodation: Joi.string().valid('yes', 'no').required().error(() => ({
      message: 'mAccommodation'
    })),
    arrivalDate: Joi.date().format('YYYY-MM-DD').min(moment().format('YYYY-MM-DD')).required()
      .error(() => ({
        message: 'mArrivalDate'
      })),
    departureDate: Joi.date().format('YYYY-MM-DD').min(Joi.ref('arrivalDate'))
      .error(() => ({
        message: 'mStopsDepDate'
      })),
    reason: Joi.string().min(10).required()
      .error(() => ({
        message: 'mReason'
      })),
  });
  const errors = stops.map((item) => {
    let err;
    Joi.validate(item, schema, (error) => {
      if (error) {
        err = error.details.map((e) => (req.i18n.__(e.message)));
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
  next();
};
