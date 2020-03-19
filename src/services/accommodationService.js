import Models from 'database/models';

const {
  Accommodations, Ratings
} = Models;

/**
 * @description This class contains methods that help to manipulate the accommodations table
 */
class accommodationService {
/**
     *
     * @param {string} accommodationId
     * @returns {object} results
     */
  static async averageRatings(accommodationId) {
    const rating = await Ratings.findAll({
      attributes: ['accommodationId', [Models.sequelize.fn('AVG', Models.sequelize.col('rating')), 'ratingAVG']],
      group: 'accommodationId',
      order: [[Models.sequelize.fn('AVG', Models.sequelize.col('rating')), 'DESC']],
      where: { accommodationId }
    });

    await Accommodations.update(
      { average_ratings: rating[0].dataValues.ratingAVG },
      { where: { id: accommodationId } },
    );
  }
}

export default accommodationService;
