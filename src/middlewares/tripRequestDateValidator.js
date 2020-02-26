import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import setLanguage from 'utils/international';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);
const dateValidator = (req, res, next) => {
  const { preferedLang } = req.user;
  const dataSchema = Joi.object().keys({

    returnDate: Joi.date().format('YYYY-MM-DD').error(() => ({
      message: setLanguage(preferedLang).__('validReturnDate')
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
