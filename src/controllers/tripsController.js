/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import { successResponse, errorResponse } from 'utils/responses';
import tripHelper from 'utils/tripHelper';
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
          type, fromCountry,
          fromCity, toCountry, toCity,
          reason, departureDate, accommodation,
          returnDate
        },
        user: {
          email, userID, role, passportNumber, gender, managerEmail
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
          manager: managerEmail,
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
  static async multiCityTrip(req, res) {
    try {
      const {
        body: {
          fromCountry, fromCity, toCountry, toCity, stops
        },
        user: {
          userID, gender, passportNumber, managerEmail
        }
      } = req;
      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;

      if (stops.length <= 1) {
        return errorResponse(res, 403, req.i18n.__('multiCityFailure'));
      }

      await tripHelper.createTrip(userID, passportNumber, gender, from, to, managerEmail, req.body);

      successResponse(res, 201, req.i18n.__('multiCitySuccess'));
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  }
}

export default tripsController;
