/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import { successResponse, errorResponse } from 'utils/responses';
import tripHelper from 'utils/tripHelper';
import Models from 'database/models';
import setLanguage from 'utils/international';
import paginate from '../utils/pagination';

const { travelRequests } = Models;

/**
 * @description This class contains all the methods relating to the trip requests
 * @class travelRequests
 */
class tripsController {
  /**
      * @memberof tripsController
      * @param  {object} req
      * @param  {object} res
      * @param  {string} passportNumber
      * @param  {string} gender
      * @param  {string} fromCountry
      * @param  {string} fromCity
      * @param  {string} toCountry
      * @param  {string} toCity
      * @param  {string} reason
      * @param  {string} departureDate
      * @param  {string} accommodation
      * @return  {string} status
      * @return  {string} message
      * @return  {object} data {email, passportNumber, from, to, reason}
      */
  static async createTrip(req, res) {
    try {
      const {
        body: {
          type, fromCountry,
          fromCity, toCountry, toCity,
          reason, departureDate, accommodation,
          returnDate
        },
        user: {
          email, userID, passportNumber, gender, managerEmail, preferedLang
        }
      } = req;

      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;
      await travelRequests.create(
        {
          requestId: uuid(),
          userID,
          type,
          passportNumber,
          gender,
          from,
          to,
          accommodation,
          reason,
          manager: managerEmail,
          departureDate,
          returnDate,
          status: 'pending'
        }
      );
      return res.status(201).json({
        status: 201,
        message: setLanguage(preferedLang).__('requestSuccessfully'),
        data: {
          email,
          passportNumber,
          from,
          to,
          reason,
        }
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        errors: {
          error: error.detail
        }
      });
    }
  }

  /**
     *
     * @param {object} req
     * @param {object} res
     * @returns {object} response
     * @memberof tripsController
     */
  static async multiCityTrip(req, res) {
    try {
      const {
        body: {
          fromCountry, fromCity, toCountry, toCity, stops
        },
        user: {
          userID, gender, passportNumber, managerEmail, preferedLang
        }
      } = req;
      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;

      if (stops.length <= 1) {
        return errorResponse(res, 403, setLanguage(preferedLang).__('multiCityFailure'));
      }

      await tripHelper.createTrip(userID, passportNumber, gender, from, to, managerEmail, req.body);

      successResponse(res, 201, setLanguage(preferedLang).__('multiCitySuccess'));
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  }

  static async getTrips(req, res) {
    const {
      query: {
        page, limit,
      },
      user: {
        userID, preferedLang
      }
    } = req;
    const pagination = paginate(page, limit);
    try {
      const trips = await travelRequests.findAll({
        where: { userID },
        attributes: {
          exclude: ['id', 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt']
        },
        offset: pagination.offset,
        limit: pagination.limit,
      });
      return res.status(200).json({
        status: 200,
        message: setLanguage(preferedLang).__('retrievedSuccessfully'),
        info: pagination.info,
        data: trips
      });
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  }
}

export default tripsController;
