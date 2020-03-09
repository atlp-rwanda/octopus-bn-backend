import Models from 'database/models';
import { errorResponse } from 'utils/responses';
import setLanguage from '../utils/international';
import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
import JoiCountryExtension from 'joi-country-extension';

const Joi = BaseJoi.extend(Extension, JoiCountryExtension);
const {
  Accommodations, Rooms, travelRequests, Booking
} = Models;


export const isAccomendationExist = async (req, res, next) => {
  const {
    user: {
      preferedLang
    },
    body: {
      accommodationId
    }
  } = req;
  const accommodation = await Accommodations.findOne({ where: { id: accommodationId } });
  if (!accommodation) {
    return errorResponse(res, 404, setLanguage(preferedLang).__('AccomondationNotExis'));
  }
  next();
};

export const isRoomExist = async (req, res, next) => {
  const {
    user: {
      preferedLang
    },
    body: {
      roomId
    }
  } = req;
  const room = await Rooms.findOne({ where: { id: roomId } });
  if (!room) {
    return errorResponse(res, 404, setLanguage(preferedLang).__('RoomIdNotExist'));
  }
  req.room = room;
  next();
};

export const isTripExist = async (req, res, next) => {
  const {
    user: {
      preferedLang
    },
    body: {
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

export const checkInAndCheckoutValidator = (req, res, next) => {
  const { preferedLang } = req.user;
  const dataSchema = Joi.object().keys({

     checkIn: Joi.date().format('YYYY-MM-DD').error(() => ({
      message: setLanguage(preferedLang).__('ValidCheckInDate')
    })),
     checkOut: Joi.date().format('YYYY-MM-DD').error(() => ({
      message: setLanguage(preferedLang).__('ValidCheckoutDate')
    })).min(Joi.ref('checkIn')).required()
    .error(() => ({
      message: `${setLanguage(preferedLang).__('validCheckoutOn')} ${req.body.checkIn}`
    }))
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
export const isRoomAlreadyBooked = async (req, res, next) => {
  const {
    user: {
      preferedLang
    },
    room: {
      status
    }
  } = req;
  if (!status) {
    return errorResponse(res, 404, setLanguage(preferedLang).__('RoomAlreadyBooked'));
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
