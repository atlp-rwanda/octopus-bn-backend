import uuid from 'uuid/v4';
import Models from 'database/models';

const { travelRequests } = Models;

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
        requestId: uuid(),
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
          'requestId',
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
}

export default tripHelper;
