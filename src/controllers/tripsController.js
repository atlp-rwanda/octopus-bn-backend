/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import { successResponse, errorResponse } from 'utils/responses';
import Models from 'database/models';

const { travelRequests } = Models;

/**
 * @description This class contains all the methods relating to the trip requests
 * @class travelRequests
 */
class tripsController {
  static async createTrip(req, res) {
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

    try {
      const {
        body: {
          type, passportNumber, gender, fromCountry,
          fromCity, toCountry, toCity,
          reason, departureDate, accommodation,
          returnDate
        },
        user: {
          email, userID, role
        }
      } = req;
      if (role !== 'requester') {
        return res.status(409).json({
          status: 409,
          error: 'with your role you are not allowed to send a trip request'
        });
      }

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
          departureDate,
          returnDate,
          status: 'pending'
        }
      );
      return res.status(201).json({
        status: 201,
        message: req.i18n.__('requestSuccessfully'),
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
  static async createMultiCityTrip(req, res) {
    try {
      const multiTrips = req.body;
      const { role, userID } = req.user;
      const id = uuid();
      const isRequester = await Models.Users.findOne({ where: { role } });

      if (!isRequester) {
        return errorResponse(res, 401, 'You must be a requester to send this request');
      }

      multiTrips.forEach(async (trip) => {
        const {
          type, passportNumber, gender, fromCountry,
          fromCity, toCountry, toCity, departureDate, reason, accommodation
        } = trip;
        const from = `${fromCountry} - ${fromCity}`;
        const to = `${toCountry} - ${toCity}`;

        await travelRequests.create({
          requestId: id,
          userID,
          type,
          passportNumber,
          gender,
          from,
          to,
          accommodation,
          reason,
          departureDate,
        });
      });

      successResponse(res, 201, 'Your multi city trip request has been recorded');
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  }
}

export default tripsController;
