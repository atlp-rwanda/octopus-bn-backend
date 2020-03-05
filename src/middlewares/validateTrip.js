import Joi from 'joi';
import Models from 'database/models';
import { errorResponse } from 'utils/responses';
import setLanguage from '../utils/international';

const { travelRequests } = Models;

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
  const trip = await travelRequests.findOne({ where: { requestId: tripId } });
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
    foundAssign = await travelRequests.findOne({ where: { manager: email, requestId: tripId } });
  if (!foundAssign) {
    return errorResponse(res, 403, setLanguage(preferedLang).__('TripNotAssigned'));
  }
  next();
};
