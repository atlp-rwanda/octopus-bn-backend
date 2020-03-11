  
/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
import { emailTripRequest } from '../utils/emailHelper';
import Models from '../database/models';
import { onlineClients } from '../utils/socket';
import setLanguage from '../utils/international';

class notificationsController {
  /**
   * @description Sending new trip request notification to the manager
   * @param {*} user
   * @param {*} type
   * @param {*} request
   * @param {*} host
   */
  static async sendTripReqNotification(user, type, request, body, host) {
    try {
      const { managerEmail } = user,
        { id } = request,
        { Users } = Models,
        manager = await Users.findOne({
          where: {
            email: managerEmail
          },
        }),
        notification = {
          requestID: id, receiver: manager.id, type, body, isRead: false
        };
      await Models.Notification.create(notification);

      const online = onlineClients.get(manager.id.toString());
      if (online) {
        online.emit('notification', notification);
      }

      if (manager.notifyByEmail) {
        await emailTripRequest(manager.firstName, manager.email, body, id, host);
      }
    } catch (error) {
      return {
        status: 500,
        error: error.message
      };
    }
  }

  /**
   * @description As a requester,
   * I should be able to see notifications
   * when my travel request has been approved by my manager
   * @param {*} user
   * @param {*} type
   * @param {*} request
   * @param {*} host
   */
  static async ApprovalStatusNotification(type, request, body, host) {
    try {
      const { id, userID } = request,
        { Users } = Models,
        user = await Users.findOne({
          where: {
            id: userID
          },
        }),
        notification = {
          requestID: id, receiver: userID, type, body, isRead: false
        };
      await Models.Notification.create(notification);
      const online = onlineClients.get(userID.toString());
      if (online) {
        online.emit('notification', notification);
      }

      if (user.notifyByEmail) {
        await emailTripRequest(user.firstName, user.email, body, id, host);
      }
    } catch (error) {
      return {
        status: 500,
        error: error.message
      };
    }
  }

  /**
   * @description As a requester,
   * I should be able to see notifications
   * when my travel request has been approved by my manager
   * @param {*} user
   * @param {*} type
   * @param {*} request
   * @param {*} host
   */
  static async ApprovalStatusNotification(type, request, body, host) {
    try {
      const { requestId, userID } = request,
        { Users } = Models,
        user = await Users.findOne({
          where: {
            id: userID
          },
        }),
        notification = {
          requestID: requestId, receiver: userID, type, body, isRead: false
        };
      await Models.Notification.create(notification);
      const online = onlineClients.get(userID.toString());
      if (online) {
        online.emit('notification', notification);
      }

      if (user.notifyByEmail) {
        await emailTripRequest(user.firstName, user.email, body, requestId, host);
      }
    } catch (error) {
      return {
        status: 500,
        error: error.message
      };
    }
  }

  /**
   * @description Disable/enable In-App/Email notifications
   * @param {*} req
   * @param {*} res
   */
  static async changePreferrence(req, res) {
    try {
      const {
          body: {
            notifyByEmail
          },
          user: {
            email, preferedLang
          }
        } = req,
        byEmail = notifyByEmail.toLowerCase() === 'true';
      await Models.Users.update(
        {
          notifyByEmail: byEmail,
        },
        { where: { email } }
      );
      return res.status(200).json({
        status: 200,
        message: setLanguage(preferedLang).__('changedpreferences'),
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }

  /**
 * @description view all notifications
 * @param {*} req
 * @param {*} res
 */
  static async getAllNotifications(req, res) {
    try {
      const { id, preferedLang } = req.user,
        notifications = await Models.Notification.findAll({
          where: {
            receiver: id
          },
        });

      if (notifications.length === 0 || notifications.length === undefined) {
        return res.status(404).json({
          status: 404,
          message: setLanguage(preferedLang).__('noNotification')
        });
      }
      return res.status(200).json({
        status: 200,
        data: notifications
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }

  /**
 * View all unread notifications
 * @param {*} req
 * @param {*} res
 */
  static async unReadNotifications(req, res) {
    try {
      const { id, preferedLang } = req.user,
        unReadNotifications = await Models.Notification.findAll({
          where: {
            receiver: id,
            isRead: false,
          },
        });
      if (unReadNotifications.length === 0 || unReadNotifications.length === undefined) {
        return res.status(404).json({
          status: 404,
          message: setLanguage(preferedLang).__('noNewNotification')
        });
      }
      return res.status(200).json({
        status: 200,
        data: unReadNotifications
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }
}

export default notificationsController;