/* eslint-disable require-jsdoc */
import Models from 'database/models';
import uuid from 'uuid/v4';
import { successResponse, errorResponse } from 'utils/responses';
import setLanguage from 'utils/international';
import bookingService from 'services/bookingService';
import accommodationService from 'services/accommodationService';
import paginate from 'utils/paginate';

const {
  Users, Accommodations, Rooms, travelRequests, Booking, Feedbacks, Ratings, AcommodationLikesAndUnlikes
} = Models;
class accommodation {
  static async create(req, res) {
    try {
      const {
        body: {
          name, country, city, imageUrl, amenities, around
        }, user: { id, preferedLang }
      } = req;
      const charName = name.toLowerCase();
      const results = await Accommodations.create({
        id: uuid(),
        name: charName,
        country,
        city,
        createdBy: id,
        imageUrl,
        amenities,
        around
      });

      return res.status(201).json({
        status: 201,
        message: setLanguage(preferedLang).__('AccommodationCreated'),
        data: {
          results
        }
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        errors: {
          error: error.message
        }
      });
    }
  }

  static async addRoom(req, res) {
    try {
      const {
        body: {
          accommodationsID, roomNumber, cost, currency, type
        }, user: { id, preferedLang }
      } = req;
      const results = await Rooms.create({
        id: uuid(),
        status: true,
        accommodationsID,
        roomNumber,
        cost,
        currency,
        type,
        createdBy: id
      });
      return res.status(201).json({
        status: 201,
        message: setLanguage(preferedLang).__('roomAdded'),
        data: results
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        errors: {
          error: error.message
        }
      });
    }
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} accomodations
   */
  static async getAccommodationPerDestination(req, res) {
    try {
      const {
        query: {
          page, limit,
          id
        },
        user: {
          preferedLang
        }
      } = req;
      const findRequest = await travelRequests.findOne({ where: { id } });

      if (!findRequest) {
        return errorResponse(res, 404, setLanguage(preferedLang).__('noRequestFound'));
      }

      if (findRequest.status !== 'pending') {
        return errorResponse(res, 403, setLanguage(preferedLang).__('rejected'));
      }

      const to = findRequest.to.split(' - ')[1];
      const accommodations = await bookingService.getAccommodations(to, page, limit);
      if (accommodations === null) {
        return errorResponse(res, 404, setLanguage(preferedLang).__('NoAccommondation'));
      }

      return successResponse(res, 200, setLanguage(preferedLang).__('accommodationsPerDest'), accommodations);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async bookAccommodation(req, res) {
    try {
      const {
        body: {
          accommodationId, roomId, tripId, checkIn, checkOut
        },
        user: {
          preferedLang, id
        }
      } = req;

      await Booking.create({
        id: uuid(),
        userId: id,
        accommodationId,
        roomId,
        checkOut,
        tripId,
        checkIn,
        isPaid: false
      });

      await Rooms.update(
        { status: false }, { where: { id: roomId } }
      );

      return successResponse(res, 201, setLanguage(preferedLang).__('bookedSuccess'));
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async feedback(req, res) {
    try {
      const {
        query: {
          accommodationId
        },
        body: {
          feedback
        },
        user: {
          id, email, preferedLang
        }
      } = req;
      const data = await Accommodations.findAll({
        where: { id: accommodationId }
      });
      if (data.length <= 0) {
        return errorResponse(res, 404, setLanguage(preferedLang).__('AccommodationNotFound'));
      }
      await Feedbacks.create({
        id: uuid(),
        accommodationId,
        feedback,
        userId: id
      });
      return successResponse(res, 201, setLanguage(preferedLang).__('ThankFeedback'));
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  }

  static async addRatings(req, res) {
    try {
      const { body: { accommodationId, rating }, user: { id, preferedLang } } = req;
      const data = await Accommodations.findOne({
        where: { id: accommodationId }
      });
      if (!data) {
        return errorResponse(res, 404, setLanguage(preferedLang).__('notFoundAccommodation'));
      }
      const preRatings = await Ratings.findOne({
        where: { userId: id, accommodationId }
      });
      if (preRatings) {
        await Ratings.update(
          { rating },
          {
            where: { userId: id, accommodationId },
            returning: true
          }
        );
        await accommodationService.averageRatings(accommodationId);

        return successResponse(res, 200, setLanguage(preferedLang).__('thanksYouAgain'));
      }
      await Ratings.create({
        id: uuid(),
        userId: id,
        accommodationId,
        rating
      });
      await accommodationService.averageRatings(accommodationId);

      return successResponse(res, 201, setLanguage(preferedLang).__('ThanksYouRating'));
    } catch (error) {
      return res.status(error.status || 500).json({
        errors: {
          error: error.message
        }
      });
    }
  }

  static async getAccommodationLikes(req, res) {
    try {
      const {
        params: {
          accommodationId
        },
      } = req;
      const { count, rows } = await AcommodationLikesAndUnlikes.findAndCountAll({
        where: {
          accommodationId
        },
        include: [
          {
            model: Users,
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password',
                'notifyByEmail', 'role', 'passportNumber', 'bio',
                'managerEmail', 'gender', 'department', 'preferedCurrency',
                'preferedLang', 'residence', 'birthDate', 'method',
                'email', 'isUpdated', 'isVerified'
              ]
            }
          },
        ]
      });
      return res.status(200).json({
        status: 200,
        data: { count, rows }
      });
    } catch (error) {
      return res.status(500).json({
        errors: {
          error: error.message
        }
      });
    }
  }

  static async LikeOrUnlike(req, res) {
    try {
      const {
        params: {
          accommodationId
        },
        user: {
          id,
        }
      } = req;
      const liked = await AcommodationLikesAndUnlikes.findOne({ where: { userId: id, accommodationId, } });
      const like = {
        id: uuid(),
        userId: id,
        accommodationId,
      };
      if (!liked) {
        await AcommodationLikesAndUnlikes.create(like);
        return res.status(201).json({
          status: 201,
          message: 'liked',
        });
      }
      await AcommodationLikesAndUnlikes.destroy({ where: { userId: id, accommodationId, } });
      return res.status(200).json({
        status: 200,
        message: 'unliked'
      });
    } catch (error) {
      return res.status(500).json({
        errors: {
          error: error.message
        }
      });
    }
  }
  
  /**
   * @description Find most traveled destinations
   * @param {object} req
   * @param {object} res
   * @memberof tripsController
   * @returns {object} response
   */
  static async getMostTravelledCentres(req, res) {
    try {
      const {
        user: {
          preferedLang
        },
        query: {
          page, limit,
        }
      } = req;
      const mostTraveledCentres = await bookingService.getTrendingCentres(page, limit);

      return successResponse(res, 200, setLanguage(preferedLang).__('trendingDestinations'), mostTraveledCentres);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
  
  /**
   * @description This method will fetch and display all accommodations
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static async getAllAccommodations(req, res) {
    try {
      const {
        query: {
          page, limit
        },
        user: {
          preferedLang
        }
      } = req;
      const pagination = paginate(page, limit);
      const allAccommodations = await Accommodations.findAll({
        attributes: {
          exclude: ['createdBy', 'imageUrl', 'country', 'createdAt', 'updatedAt']
        },
        include: [{
          model: Rooms,
          attributes: {
            exclude: ['accommodationsID', 'createdBy', 'createdAt', 'updatedAt']
          }
        }],
        offset: pagination.offset,
        limit: pagination.limit
      });
      const mostTraveledCentre = await bookingService.getTrendingCentres(page, limit);

      return successResponse(res, 200, setLanguage(preferedLang).__('allAccommodations'), { allAccommodations, mostTraveledCentre});
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

   /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static async searchAccommodations(req, res) {
    try {
      const {
        query: {
          page, limit, searchKey
        },
        user: {
          preferedLang
        }
      } = req;
      const results = await accommodationService.searchResults(page, limit, searchKey);

      return successResponse(res, 200, setLanguage(preferedLang).__('results'), results);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  /**
   * 
   * @param {object} req
   * @param {object} res
   * @returns {object} responsd
   */
static async getOneAccommodation(req, res) {
  try {
    const {
      params: {
        id
      },
      user: {
        preferedLang
      }
    } = req;
    const result = await Accommodations.findOne({
      where: { id },
      include: [
        {
          model: Rooms,
          attributes: {
            exclude: ['accommodationsID', 'createdBy', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Feedbacks,
          attributes: { exclude: ['accommodationId', 'userId', 'createdAt', 'updatedAt'] },
          include: [{
            model: Users,
            attributes: {
              exclude: ['password']
            }
          }]
        }
      ]
    });

    if (!result) {
      return errorResponse(res, 404, setLanguage(preferedLang).__('accommodationIdNotFound'));
    }

    return successResponse(res, 200, setLanguage(preferedLang).__('oneAccommodation'), result);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}
}

export default accommodation;
