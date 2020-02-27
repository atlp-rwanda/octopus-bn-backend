import Joi from 'joi';
import setLanguage from 'utils/international';

const validateParams = (req, res, next) => {
  const { preferedLang } = req.user;
  const Schemas = Joi.object().keys({
    page: Joi.number().min(0).error(() => ({
      message: setLanguage(preferedLang).__('InvalidParams')
    })),
    limit: Joi.number().min(0).error(() => ({
      message: setLanguage(preferedLang).__('InvalidParams')
    })),
    searchKey: Joi.string().min(0).error(() => ({
      message: setLanguage(preferedLang).__('InvalidParams')
    })),
  });
  const { error } = Joi.validate(req.query, Schemas);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }
  next();
};
export default validateParams;
