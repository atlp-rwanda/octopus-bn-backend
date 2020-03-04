import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import setLanguage from 'utils/international';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);
const accommodationValidator = (req, res, next) => {
  const { preferedLang } = req.user;
  const dataSchema = Joi.object().keys({
    name: Joi.string().min(3).required().error(() => ({
      message: setLanguage(preferedLang).__('validAccommodationName')
    })),
    country: Joi.string().country().required().error(() => ({
      message: setLanguage(preferedLang).__('validCountry')
    })),
    city: Joi.string().required().error(() => ({
      message: setLanguage(preferedLang).__('validCity')
    })),
    imageUrl: Joi.string().min(3).required().error(() => ({
      message: setLanguage(preferedLang).__('validImageUrl')
    })),
    amenities: Joi.array().items(Joi.string()).min(1).required()
      .error(() => ({
        message: setLanguage(preferedLang).__('oneAmenity')
      })),
    around: Joi.array().items(Joi.string()).min(1).required()
      .error(() => ({
        message: setLanguage(preferedLang).__('aroundAccommodation')
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
export default accommodationValidator;
