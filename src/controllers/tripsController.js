/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import { successResponse, errorResponse } from 'utils/responses';
import tripService from 'services/tripsService';
import Models from 'database/models';
import setLanguage from 'utils/international';
import paginate from 'utils/pagination';
import Sequelize from 'sequelize';


const {
  Op, where, cast, col
} = Sequelize;

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
          email, id, passportNumber, gender, managerEmail, preferedLang
        }
      } = req;

      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;
      await travelRequests.create(
        {
          requestId: uuid(),
          userID: id,
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
          id, gender, passportNumber, managerEmail, preferedLang
        }
      } = req;
      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;

      if (stops.length <= 1) {
        return errorResponse(res, 403, setLanguage(preferedLang).__('multiCityFailure'));
      }

      await tripService.createTrip(id, passportNumber,
        gender, from, to, managerEmail, req.body);

      successResponse(res, 201, setLanguage(preferedLang).__('multiCitySuccess'));
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static async availRequests(req, res) {
    try {
      const {
        query: {
          page, limit,
        },
        user: {
          role, email, preferedLang
        }
      } = req;

      if (role !== 'manager') {
        return errorResponse(res, 401, setLanguage(preferedLang).__('mustBeManager'));
      }

      const all = await tripService.availPendingRequests(email, page, limit);

      return successResponse(res, 200, setLanguage(preferedLang).__('pendingRequestsRetrieved'), all);
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
        id, preferedLang
      }
    } = req;
    const pagination = paginate(page, limit);
    try {
      const trips = await travelRequests.findAll({
        where: { userID: id },
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

  static async searchTrips(req, res) {
    const {
      body: {
        searchKey
      },
      query: {
        page, limit,
      },
      user: {
        id, role, email, preferedLang
      }
    } = req;
    const pagination = paginate(page, limit);
    try {
      let found;
      const searchQuery = [
        where(
          cast(col('travelRequests.requestId'), 'varchar'),
          { [Op.like]: `%${searchKey}%` }
        ),
        where(
          cast(col('travelRequests.type'), 'varchar'),
          { [Op.like]: `%${searchKey}%` }
        ),
        where(
          cast(col('travelRequests.gender'), 'varchar'),
          { [Op.like]: `%${searchKey}%` }
        ),
        where(
          cast(col('travelRequests.status'), 'varchar'),
          { [Op.like]: `%${searchKey}%` }
        ),
        where(
          cast(col('travelRequests.stops'), 'varchar'),
          { [Op.like]: `%${searchKey}%` }
        ),

        where(
          cast(col('travelRequests.status'), 'varchar'),
          { [Op.like]: `%${searchKey}%` }
        ),
        { from: { [Op.like]: `%${searchKey}%`, }, },
        { to: { [Op.like]: `%${searchKey}%`, }, },
        { from: { [Op.like]: `%${searchKey}%`, }, },
        { to: { [Op.like]: `%${searchKey}%`, }, },
        { reason: { [Op.like]: `%${searchKey}%`, }, },
      ];
      if (role === 'requester') {
        found = await travelRequests.findAll({
          where: {
            userID: id,
            [Op.or]: searchQuery
          },
          attributes: {
            exclude: ['id', 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt']
          },
          offset: pagination.offset,
          limit: pagination.limit,
        });
      }
      if (role === 'manager') {
        found = await travelRequests.findAll({
          where: {
            manager: email,
            [Op.or]: searchQuery
          },
          attributes: {
            exclude: ['id', 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt']
          },
          offset: pagination.offset,
          limit: pagination.limit,
        });
      }
      found = await travelRequests.findAll({
        where: {
          [Op.or]: searchQuery
        },
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
        data: found
      });
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  }
}

export default tripsController;
