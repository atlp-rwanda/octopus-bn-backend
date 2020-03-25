/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
import { successResponse, errorResponse } from 'utils/responses';
import { emailTripRequest } from '../utils/emailHelper';
import Models from '../database/models';
import { onlineClients } from '../utils/socket';
import setLanguage from '../utils/international';

const { Users, travelRequests } = Models;

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
            const { managerEmail } = user, { id } = request,
            manager = await Users.findOne({
                    where: {
                        email: managerEmail
                    },
                }),
                notification = {
                    requestID: id,
                    receiver: manager.id,
                    type,
                    body,
                    isRead: false
                };
            const data = await Models.Notification.create(notification);

            const online = onlineClients.get(manager.id.toString());
            if (online) {
                online.emit('notification', data);
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
            user = await Users.findOne({
                    where: {
                        id: userID
                    },
                }),
                notification = {
                    requestID: id,
                    receiver: userID,
                    type,
                    body,
                    isRead: false
                };
            const data = await Models.Notification.create(notification);
            const online = onlineClients.get(userID.toString());
            if (online) {
                online.emit('notification', data);
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
     * @description Sending edited trip request notification to the manager
     * @param {*} user
     * @param {*} type
     * @param {*} request
     * @param {*} host
     */
    static async sendEditNotification(user, type, requestId, body, host) {
        try {
            const { managerEmail } = user,
            manager = await Users.findOne({
                    where: {
                        email: managerEmail
                    },
                }),
                notification = {
                    requestID: requestId,
                    receiver: manager.id,
                    type,
                    body,
                    isRead: false
                };
            const data = await Models.Notification.create(notification);

            const online = onlineClients.get(manager.id.toString());
            if (online) {
                online.emit('notification', data);
            }
        } catch (error) {
            return {
                status: 500,
                error: error.message
            };
        }
    }

    /**
     * Send notification on comment
     * @param {*} user
     * @param {*} komment
     */
    static async CommentNotification(user, komment) {
        try {
            const { firstName, lastName, imageUrl } = user;
            const { userID, requestId, comment } = komment;
            const trip = await travelRequests.findOne({
                    where: {
                        id: requestId
                    },
                }),
                manager = await Users.findOne({
                    where: {
                        email: trip.manager
                    },
                });
            const notification = {
                requestID: requestId,
                type: 'comment',
                body: comment,
                isRead: false,
                userID,
            };

            if (manager.id == userID) {
                notification.receiver = trip.userID
            } else {
                notification.receiver = manager.id
            }
            const {
                dataValues: newNotification
            } = await Models.Notification.create(notification);
            const data = {
                names: `${firstName} ${lastName}`,
                imageUrl,
                ...newNotification
            };
            const online = onlineClients.get(data.receiver.toString());

            if (online) {
                online.emit('notification', data);
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
                    email,
                    preferedLang
                }
            } = req,
            byEmail = notifyByEmail.toLowerCase() === 'true';
            await Models.Users.update({
                notifyByEmail: byEmail,
            }, { where: { email } });
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

    /**
     * @description This method is used to mark all notifications as read
     * @param {object} req
     * @param {object} res
     */
    static async markAllNotificationAsRead(req, res) {
        try {
            const { id, preferedLang } = req.user;

            await Models.Notification.update({
                isRead: true
            }, { where: { receiver: id } });

            return successResponse(res, 200, setLanguage(preferedLang).__('allmarkedAsRead'));
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default notificationsController;