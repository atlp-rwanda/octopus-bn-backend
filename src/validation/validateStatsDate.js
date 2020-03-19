import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import setLanguage from 'utils/international';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);

const validateStats = (req, res, next) => {
  const { preferedLang } = req.user;
  const schema = Joi.object().keys({
    from: Joi.date().format('YYYY-MM-DD').required()
      .error(() => ({
        message: 'fromDate'
      })),
    until: Joi.date().format('YYYY-MM-DD').required()
      .error(() => ({
        message: 'untilDate'
      })),
  });
  const { error } = Joi.validate(req.params, schema);

  if (error) {
    return res.status(400).json({
      status: 400,
      error: setLanguage(preferedLang).__(error.details[0].message)
    });
  }
  return next();
};

export default validateStats;
