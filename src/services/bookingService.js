import Models from 'database/models';
import paginate from 'utils/paginate';
import Sequelize from 'sequelize';

const { Accommodations, Rooms, Booking } = Models;

/**
 * @description This class contains services used while booking an accomodation
 */
class bookingService {
  /**
     *
     * @param {string} to
     * @param {string} page
     * @param {string} limit
     * @returns {object} accommodations
     */
  static async getAccommodations(to, page, limit) {
    const pagination = paginate(page, limit);
    const accommodations = await Accommodations.findAll({
      where: { city: to },
      attributes: {
        exclude: ['createdBy', 'imageUrl', 'country', 'createdAt', 'updatedAt']
      },
      include: [{
        model: Rooms,
        where: { status: 'true' },
        attributes: {
          exclude: ['accommodationsID', 'status', 'createdBy', 'createdAt', 'updatedAt']
        },
      }],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    return accommodations;
  }

  /**
   * @param {string} page
   * @param {string} limit
   * @returns {object} most traveled centres infos
   */
  static async getTrendingCentres(page, limit) {
    const pagination = paginate(page, limit),
      mostTraveledCentres = await Booking.findAll({
        group: ['accommodationId', 'Accommodation.id'],
        attributes: ['accommodationId', [Sequelize.fn('COUNT', 'accommodationId'), 'peopleVisited']],
        include: [{
          model: Accommodations,
          attributes: {
            exclude: ['createdBy', 'id', 'createdAt', 'updatedAt']
          }
        }],
        order: [[Sequelize.col('peopleVisited'), 'DESC']],
        offset: pagination.offset,
        limit: pagination.limit,
      });
    return mostTraveledCentres;
  }
}

export default bookingService;
