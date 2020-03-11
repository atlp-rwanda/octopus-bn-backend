import { errorResponse } from 'utils/responses';
import setLanguage from '../utils/international';
import Models from '../database/models';

const { Accommodations } = Models;

const checkIfAccomodationExist = async (req, res, next) => {
  const {
    params: {
      accommodationId
    },
    user: {
      preferedLang
    }
  } = req;
  const Accomm = await Accommodations.findOne({
    where: {
      id: accommodationId,
    }
  });
  if (!Accomm) {
    return errorResponse(res, 404, setLanguage(preferedLang).__('NoAccommondationFound'));
  }
  next();
};

export default checkIfAccomodationExist;
