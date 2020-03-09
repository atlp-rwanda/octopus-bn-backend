/* eslint-disable require-jsdoc */
import Models from 'database/models';
import uuid from 'uuid/v4';
import Sequelize from 'sequelize';
import { successResponse, errorResponse } from 'utils/responses';
import setLanguage from 'utils/international';

const { Comments, travelRequests } = Models;
const {
  Op
} = Sequelize;
class commentsController {
  // eslint-disable-next-line class-methods-use-this
  async addComment(req, res) {
    try {
      const {
        query: {
          requestId
        },
        body: {
          comment
        },
        user: {
          id, email, preferedLang
        }
      } = req;
      const found = await travelRequests.findOne({
        where: {
          id: requestId,
          [Op.or]: [
            { userID: id },
            { manager: email },
          ]
        }
      });
      if (!found) {
        return errorResponse(res, 403, setLanguage(preferedLang).__('commentSorry'));
      }
      await Comments.create({
        id: uuid(),
        userID: id,
        requestId,
        comment
      });
      return successResponse(res, 201, setLanguage(preferedLang).__('CommentPosted'), { comment, by: email || id, requestId: found.id});
    } catch (error) {
      errorResponse(res, error.status || 500, error.message);
    }
  }
  async deleteComment(req, res) {
    try {
        const { query: { commentId }, body: { comment }, user: { id, email, preferedLang } } = req;
        const found = await Comments.findOne({
            where: {
                id: commentId,
                userID: id
            }
        });
        if (found) {
            await Comments.destroy({
                where: {
                    id: commentId
                }
            }).then((data) => {
                return successResponse(res, 200, setLanguage(preferedLang).__('CommentDeleted'));
            });
        }
        return errorResponse(res, 404, setLanguage(preferedLang).__('NoComment'));
    } catch (error) {
        errorResponse(res, error.status || 500, error.message);
    }
}
}


export default commentsController;
