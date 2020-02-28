import Joi from 'joi';
import setLanguage from 'utils/international';

const roomsValidator = (req, res, next) => {
  const { preferedLang } = req.user;
  const dataSchema = Joi.object().keys({
    accommodationsID: Joi.string().guid().required().error(() => ({
      message: setLanguage(preferedLang).__('accommodationID')
    })),
    roomNumber: Joi.string().required().error(() => ({
      message: setLanguage(preferedLang).__('roomNumber')
    })),
    cost: Joi.number().required().error(() => ({
      message: setLanguage(preferedLang).__('validCost')
    })),
    currency: Joi.string().required().error(() => ({
      message: setLanguage(preferedLang).__('validCurrency')
    })),
    type: Joi.string().valid('Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Twin', 'Double-double', 'Studio', 'Master-Suite', 'Mini-Suite').required().error(() => ({
      message: setLanguage(preferedLang).__('validRoomType')
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
export default roomsValidator;
