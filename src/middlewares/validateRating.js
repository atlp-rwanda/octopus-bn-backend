import Joi from 'joi';
import setLanguage from 'utils/international';

const validateRating = (req, res, next) => {
  const { preferedLang } = req.user;
  const dataSchema = Joi.object().keys({
    accommodationId: Joi.string().guid().required().error(() => ({
      message: setLanguage(preferedLang).__('accommodationIDNot')
    })),
    rating: Joi.number().greater(0).less(6).required().error(() => ({
      message: setLanguage(preferedLang).__('validRatings')
    })),
  });

  const { error } = Joi.validate(req.body, dataSchema);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }
  return next();
};
export default validateRating;
