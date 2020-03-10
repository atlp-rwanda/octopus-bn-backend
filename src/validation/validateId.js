import Joi from 'joi';
import setLanguage from 'utils/international';

const validateParams = (req, res, next) => {
  const { preferedLang } = req.user;
  const Schemas = Joi.object().keys({
    requestId: Joi.string().guid().error(() => ({
      message: setLanguage(preferedLang).__('InvalidParamsRequestId')
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
