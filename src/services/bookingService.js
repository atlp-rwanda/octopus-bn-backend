import Models from 'database/models';
import paginate from 'utils/paginate';

const { Accommodations, Rooms } = Models;

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
}

export default bookingService;
