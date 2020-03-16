import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';
import moment from 'moment';
import Models from 'database/models';
import { errorResponse } from 'utils/responses';
import setLanguage from '../utils/international';

const { travelRequests } = Models;

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);
export const isUuidParamValid = (req, res, next) => {
  const {
    user: {
      preferedLang
    }
  } = req;
  const uuiDchemas = Joi.object().keys({
    tripId: Joi.string().guid(),
  });
  const schema = Joi.validate(req.params, uuiDchemas);
  if (schema.error) {
    return errorResponse(res, 400, setLanguage(preferedLang).__('PleaseUseValidId'));
  }
  next();
};

export const isTripExist = async (req, res, next) => {
  const {
    user: {
      preferedLang
    },
    params: {
      tripId
    }
  } = req;
  const trip = await travelRequests.findOne({ where: { id: tripId } });
  if (!trip) {
    return errorResponse(res, 404, setLanguage(preferedLang).__('TripNotFound'));
  }
  req.trip = trip;
  next();
};

export const isTripRejected = async (req, res, next) => {
  const {
    user: {
      preferedLang
    },
    trip: {
      status
    }
  } = req;
  if (status === 'rejected') {
    return errorResponse(res, 403, setLanguage(preferedLang).__('TripAlreadyRejected'));
  }
  next();
};

export const isTripApproved = async (req, res, next) => {
  const {
    user: {
      preferedLang
    },
    trip: {
      status
    }
  } = req;
  if (status === 'approved') {
    return errorResponse(res, 403, setLanguage(preferedLang).__('NotAllowedToRejecApprovedRequest'));
  }
  next();
};
export const isTripAssigned = async (req, res, next) => {
  const {
      user: {
        email,
        preferedLang
      },
      params: {
        tripId
      }
    } = req,
    foundAssign = await travelRequests.findOne({ where: { manager: email, id: tripId } });
  if (!foundAssign) {
    return errorResponse(res, 403, setLanguage(preferedLang).__('TripNotAssigned'));
  }
  next();
};
export const areYouTripOwner = async (req, res, next) => {
  const {
    user: {
      preferedLang,
      id
    },
    trip: {
      userID
    }
  } = req;
  if (userID !== id) {
    return errorResponse(res, 403, setLanguage(preferedLang).__('TripNotAssigned'));
  }
  next();
};
export const isEditTripRequestValid = (req, res, next) => {
  const { preferedLang } = req.user;
  const schema = Joi.object().keys({
    type: Joi.string().valid('one way', 'return', 'multi city').required().error(() => ({
      message: setLanguage(preferedLang).__('validType')
    })),
    stops: Joi.array().optional().error(() => ({
      message: setLanguage(preferedLang).__('StopsMustBeArray')
    })),
    fromCountry: Joi.string().country().required().error(() => ({
      message: setLanguage(preferedLang).__('validFromCountry')
    })),

    fromCity: Joi.string().required().error(() => ({
      message: setLanguage(preferedLang).__('validFromCity')
    })),

    toCountry: Joi.string().country().required().error(() => ({
      message: setLanguage(preferedLang).__('validToCountry')
    })),

    toCity: Joi.string().required().error(() => ({
      message: setLanguage(preferedLang).__('validToCity')
    })),

    accommodation: Joi.string().valid('yes', 'no').required().error(() => ({
      message: setLanguage(preferedLang).__('validAccommodation')
    })),

    departureDate: Joi.date().format('YYYY-MM-DD').min(moment().format('YYYY-MM-DD'))
      .required()
      .error(() => ({
        message: setLanguage(preferedLang).__('validDepartureDate')
      })),

    returnDate: Joi.date().format('YYYY-MM-DD').when('type', {
      is: Joi.string().regex(/^return$/),
      then: Joi.date().min(Joi.ref('departureDate')).required()
        .error(() => ({
          message: `${setLanguage(preferedLang).__('validReturnOn')} ${req.body.departureDate}`
        })),
      otherwise: Joi.date().max(0).error(() => ({
        message: setLanguage(preferedLang).__('onlyReturn')
      })),
    }),

    reason: Joi.string().min(20).required().error(() => ({
      message: setLanguage(preferedLang).__('ValidReason')
    })),
  });

  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message
    });
  }
  return next();
};

