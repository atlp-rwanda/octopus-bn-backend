/* eslint-disable require-jsdoc */
import Models from 'database/models';
import uuid from 'uuid/v4';
import setLanguage from 'utils/international';

const { Accommodations, Rooms } = Models;

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
}

export default accommodation;
