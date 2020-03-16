import uuid from 'uuid/v4';
import Models from 'database/models';
import paginate from 'utils/paginate';
import { Op } from 'sequelize';

const { travelRequests, Users } = Models;

/**
 * @description This class contains trip helpers methods
 */
class tripHelper {
  /**
     * @param {string} uId
     * @param {string} passportNumber
     * @param {string} gender
     * @param {string} from
     * @param {string} to,
     * @param {string} manager
     * @param {object} newTrip
     * @returns {object} trip
     */
  static async createTrip(uId, passportNumber, gender, from, to, manager, newTrip) {
    const trip = await travelRequests.create(
      {
        ...newTrip,
        id: uuid(),
        userID: uId,
        from,
        to,
        status: 'pending',
        gender,
        passportNumber,
        manager
      },
      {
        fields: [
          'id',
          'userID',
          'passportNumber',
          'gender',
          'status',
          'type',
          'accommodation',
          'reason',
          'departureDate',
          'returnDate',
          'from',
          'to',
          'stops',
          'manager'
        ]
      }
    );

    return trip;
  }

  /**
   *
   * @param {string} email
   * @param {string} page
   * @param {string} limit
   * @returns {object} allTrips
   */
  static async availPendingRequests(email, page, limit) {
    const pagination = paginate(page, limit);
    const allTrips = await travelRequests.findAll({
      where: {
        status: 'pending', manager: email
      },
      attributes: {
        exclude: ['userID', 'gender', 'manager', 'createdAt', 'updatedAt', 'passportNumber']
      },
      include: [{
        model: Users,
        attributes: {
          exclude: [ 'method', 'password', 'isVerified', 'isUpdated', 'gender', 'birthDate', 'preferedLang',
            'preferedCurrency', 'residence', 'managerEmail', 'imageUrl', 'bio', 'role', 'createdAt', 'updatedAt']
        }
      }],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    return allTrips;
  }

  /**
   * @description this method will calculate the stats of a user's requests
   * @param {object} data
   * @returns {object} stats
   */
  static async getTripstats(data) {
    const { id, from, until } = data;
    const { count, rows } = await travelRequests.findAndCountAll({
      where: {
        userID: id,
        createdAt: {
          [Op.between]: [from, until]
        }
      },
      order: [
        ['createdAt', 'ASC']
      ]
    });
    const approvedRequests = rows.filter((request) => request.status === 'approved');
    const pendingRequests = rows.filter((request) => request.status === 'pending');
    const rejectedRequests = rows.filter((request) => request.status === 'rejected');

    return {
      allTripRequests: count,
      approvedRequests: approvedRequests.length,
      pendingRequests: pendingRequests.length,
      rejectedRequests: rejectedRequests.length
    };
  }
}

export default tripHelper;
