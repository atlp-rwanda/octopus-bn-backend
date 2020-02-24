import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);
const dateValidator = (req, res, next) => {
  const dataSchema = Joi.object().keys({
    departureDate: Joi.date().format('YYYY-MM-DD').error(() => ({
      message: 'Date format must be YYYY-MM-DD'
    })),

    returnDate: Joi.date().format('YYYY-MM-DD').error(() => ({
      message: 'Date format must be YYYY-MM-DD'
    })),
  }).unknown(true);

  const { error } = Joi.validate(req.body, dataSchema);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }
  return next();
};
export default dateValidator;
