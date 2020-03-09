/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import { successResponse, errorResponse } from 'utils/responses';
import tripService from 'services/tripsService';
import Models from 'database/models';
import setLanguage from 'utils/international';
import paginate from 'utils/paginate';
import Sequelize from 'sequelize';
import {
  oneWayTripGenerator,
  returnTripGenerator,
  multiCityTripGenerator
} from 'utils/objectPropertyExcluder';
import notificationsController from './notification';


const { sendTripReqNotification } = notificationsController;
const { Op, where, cast, col } = Sequelize;

const { travelRequests, Comments } = Models;

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
          email, id, passportNumber, gender, managerEmail, preferedLang, firstName,
        },
        headers: { host }
      } = req;

      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;
      const request = await travelRequests.create(
        {
          id: uuid(),
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
      const body = ` ${firstName} made a trip request: - From ${from} to ${to}. Reason: ${reason}`;
      await sendTripReqNotification(req.user, 'trip request', request, body, host);
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
          error: error.message
        }
      });
    }
  }
	static async createTrip(req, res) {
		try {
			const {
				body: {
					type,
					fromCountry,
					fromCity,
					toCountry,
					toCity,
					reason,
					departureDate,
					accommodation,
					returnDate
				},
				user: { email, id, passportNumber, gender, managerEmail, preferedLang }
			} = req;

			const from = `${fromCountry} - ${fromCity}`;
			const to = `${toCountry} - ${toCity}`;
			await travelRequests.create({
				id: uuid(),
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
			});
			return res.status(201).json({
				status: 201,
				message: setLanguage(preferedLang).__('requestSuccessfully'),
				data: {
					email,
					passportNumber,
					from,
					to,
					reason
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
          id, gender, firstName, passportNumber, managerEmail, preferedLang
        },
        header: { host }
      } = req;
      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;

      if (stops.length <= 1) {
        return errorResponse(res, 403, setLanguage(preferedLang).__('multiCityFailure'));
      }
      const request = await tripService.createTrip(id, passportNumber,
        gender, from, to, managerEmail, req.body);
      const notificationbody = ` ${firstName} made a multi-city trip request: - From ${from} to ${to}.`;
      await sendTripReqNotification(req.user, 'multi-city trip request', request, notificationbody, host);
      successResponse(res, 201, setLanguage(preferedLang).__('multiCitySuccess'));
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
	static async multiCityTrip(req, res) {
		try {
			const {
				body: { fromCountry, fromCity, toCountry, toCity, stops },
				user: { id, gender, passportNumber, managerEmail, preferedLang }
			} = req;
			const from = `${fromCountry} - ${fromCity}`;
			const to = `${toCountry} - ${toCity}`;

			if (stops.length <= 1) {
				return errorResponse(res, 403, setLanguage(preferedLang).__('multiCityFailure'));
			}

			await tripService.createTrip(id, passportNumber, gender, from, to, managerEmail, req.body);

			return successResponse(res, 201, setLanguage(preferedLang).__('multiCitySuccess'));
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
	static async availRequests(req, res) {
		try {
			const { query: { page, limit }, user: { role, email, preferedLang } } = req;

			if (role !== 'manager') {
				return errorResponse(res, 401, setLanguage(preferedLang).__('mustBeManager'));
			}

			const all = await tripService.availPendingRequests(email, page, limit);

			return successResponse(res, 200, setLanguage(preferedLang).__('pendingRequestsRetrieved'), all);
		} catch (error) {
		return	errorResponse(res, 500, error.message);
		}
	}

	static async getTrips(req, res) {
		const { query: { page, limit }, user: { id, preferedLang, role, email } } = req;
		const pagination = paginate(page, limit);
		try {
			let trips;
			if (role === 'requester') {
				trips = await travelRequests.findAll({
					where: { userID: id },
					attributes: {
						exclude: [ 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt' ]
					},
					include: [ { model: Comments } ],
					offset: pagination.offset,
					limit: pagination.limit
				});
			}
			if (role === 'manager') {
				trips = await travelRequests.findAll({
					where: {
						manager: email
					},
					attributes: {
						exclude: [ 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt' ]
          },
          include: [{
            model: Comments,
            attributes: {
              exclude: ['id' ]
            }
          }],
					offset: pagination.offset,
					limit: pagination.limit
				});
			}
			trips = await travelRequests.findAll({
				attributes: {
					exclude: [ 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt' ]
        },
        include: [ { model: Comments } ],
				offset: pagination.offset,
				limit: pagination.limit
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
		const { query: { page, limit, searchKey }, user: { id, role, email, preferedLang } } = req;
		const pagination = paginate(page, limit);
		try {
			let found;
			const searchQuery = [
				where(cast(col('travelRequests.id'), 'varchar'), { [Op.like]: `%${searchKey}%` }),
				where(cast(col('travelRequests.type'), 'varchar'), { [Op.like]: `%${searchKey}%` }),
				where(cast(col('travelRequests.gender'), 'varchar'), { [Op.like]: `%${searchKey}%` }),
				where(cast(col('travelRequests.status'), 'varchar'), { [Op.like]: `%${searchKey}%` }),
				where(cast(col('travelRequests.stops'), 'varchar'), { [Op.like]: `%${searchKey}%` }),

				where(cast(col('travelRequests.status'), 'varchar'), { [Op.like]: `%${searchKey}%` }),
				{ from: { [Op.like]: `%${searchKey}%` } },
				{ to: { [Op.like]: `%${searchKey}%` } },
				{ from: { [Op.like]: `%${searchKey}%` } },
				{ to: { [Op.like]: `%${searchKey}%` } },
				{ reason: { [Op.like]: `%${searchKey}%` } }
			];
			if (role === 'requester') {
				found = await travelRequests.findAll({
					where: {
						userID: id,
						[Op.or]: searchQuery
					},
					attributes: {
						exclude: [ 'id', 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt' ]
					},
					offset: pagination.offset,
					limit: pagination.limit
				});
			}
			if (role === 'manager') {
				found = await travelRequests.findAll({
					where: {
						manager: email,
						[Op.or]: searchQuery
					},
					attributes: {
						exclude: [ 'id', 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt' ]
					},
					offset: pagination.offset,
					limit: pagination.limit
				});
			}
			found = await travelRequests.findAll({
				where: {
					[Op.or]: searchQuery
				},
				attributes: {
					exclude: [ 'id', 'userID', 'passportNumber', 'gender', 'createdAt', 'updatedAt' ]
				},
				offset: pagination.offset,
				limit: pagination.limit
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

  /**
     *
     * @param {object} req
     * @param {object} res
     * @returns {object} response
     * @memberof tripsController
     */
  static async approveTrip(req, res) {
    try {
      const {
        params: {
          tripId
        },
        user: {
          preferedLang
        }
      } = req;
      const affectedRow = await travelRequests.update(
        {
          status: 'approved'
        }, {
          where: { id: tripId },
          returning: true,
          plain: true
        }
      );
      const {
        type, accommodation, from,
        to, departureDate, returnDate,
        reason, status, stops
      } = affectedRow[1];
      const response = {
        type,
        accommodation,
        from,
        to,
        departureDate,
        returnDate,
        reason,
        status,
        stops
      };
      return successResponse(res, 200, setLanguage(preferedLang).__('TripApprovedSuccess'), response);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  /**
   * @description Get one trip request
   * @param {object} req
   * @param {object} res
   * @memberof tripsController
   * @returns {object} response
   */
  static async getOnetripRequest(req, res) {
    try {
      const {
        params: {
          requestId
        },
        user: {
          id, email, preferedLang
        }
      } = req;
      const found = await travelRequests.findOne({
        where: {
          userID: id,
          id: requestId,
          [Op.or]: [
            { userID: id },
            { manager: email },
          ]
        }
      });

      if (!found) {
        return errorResponse(res, 404, setLanguage(preferedLang).__('TripNotFound'));
      }

      return successResponse(res, 200, found);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  }
	static async rejectTrip(req, res) {
		try {
			const { params: { tripId }, user: { preferedLang } } = req;
			const affectedRow = await travelRequests.update(
				{
					status: 'rejected'
				},
				{
					where: { id: tripId },
					returning: true,
					plain: true
				}
			);
			const { type, accommodation, from, to, departureDate, returnDate, reason, status, stops } = affectedRow[1];
			const response = {
				type,
				accommodation,
				from,
				to,
				departureDate,
				returnDate,
				reason,
				status,
				stops
			};
			successResponse(res, 200, setLanguage(preferedLang).__('TripRejectSuccess'), response);
		} catch (error) {
			errorResponse(res, 500, error.message);
		}
	}

  /**
   * @description Edit one way or return or multi city trip requests on one go
   * @param {object} req
   * @param {object} res
   * @memberof tripsController
   * @returns {object} response
   */
  static async editTrip(req, res) {
    try {
      const {
        body: {
          type
        },
        params: {
          tripId
        },
        body,
        user: {
          preferedLang
        }
      } = req;
      const oneWayTrip = oneWayTripGenerator(body);
      const returnTrip = returnTripGenerator(body);
      const multiCity = multiCityTripGenerator(body);
      const fineTripRequest = type === 'one way'
        ? oneWayTrip : type === 'return'
          ? returnTrip : multiCity;
      await travelRequests.update(
        fineTripRequest, {
          where: { id: tripId },
          returning: true,
          plain: true
        }
      );
      return successResponse(res, 200, setLanguage(preferedLang).__('TriprequestUpdatedSuccess'), fineTripRequest);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}


export default tripsController;
