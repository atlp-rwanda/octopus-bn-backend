/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import Models from '../database/models';

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
          email
        }
      } = req;
      const from = `${fromCountry} - ${fromCity}`;
      const to = `${toCountry} - ${toCity}`;
      await travelRequests.create(
        {
          requestId: uuid(),
          userEmail: email,
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
          error
        }
      });
    }
  }
}

export default tripsController;
