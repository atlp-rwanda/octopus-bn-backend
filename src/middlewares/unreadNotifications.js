import { errorResponse } from 'utils/responses';
import Models from 'database/models';
import setLanguage from 'utils/international';

const haveUnread = async (req, res, next) => {
  const { id, preferedLang } = req.user;
  const unread = await Models.Notification.findAll({ where: { receiver: id, isRead: false } });

  if (unread.length === 0) {
    return errorResponse(res, 404, setLanguage(preferedLang).__('noUnread'));
  }

  next();
};

export default haveUnread;
