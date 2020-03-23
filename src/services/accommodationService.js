import Models from 'database/models';
import paginate from 'utils/paginate';
import {
  Op, where, cast, col
} from 'sequelize';

const { Accommodations, Ratings } = Models;

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
    const totalRating = await Ratings.findAll({
      attributes: ['accommodationId', [Models.sequelize.fn('COUNT', Models.sequelize.col('rating')), 'ratingTotal']],
      group: 'accommodationId',
      order: [[Models.sequelize.fn('COUNT', Models.sequelize.col('rating'))]],
      where: { accommodationId }
    });

    console.log('total', totalRating[0].dataValues.ratingTotal);

    await Accommodations.update(
      { average_ratings: rating[0].dataValues.ratingAVG, ratings: totalRating[0].dataValues.ratingTotal},
      { where: { id: accommodationId } },
    );
  }

  /**
     * @param {string} page
     * @param {string} limit
     * @param {string} searchKey
     * @returns {obejct} results
     */
  static async searchResults(page, limit, searchKey) {
    const pagination = paginate(page, limit);
    const key = [
      where(
        cast(col('Accommodations.name'), 'varchar'),
        { [Op.like]: `%${searchKey}%` }
      ),
      where(
        cast(col('Accommodations.city'), 'varchar'),
        { [Op.like]: `%${searchKey}%` }
      )
    ];
    const results = await Accommodations.findAll({
      where: {
        [Op.or]: key
      },
      attributes: {
        exclude: ['createdBy', 'imageUrl', 'createdAt', 'updatedAt']
      },
      offset: pagination.offset,
      limit: pagination.limit
    });

    return results;
  }
}

export default accommodationService;
