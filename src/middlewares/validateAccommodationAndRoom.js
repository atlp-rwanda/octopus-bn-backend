
import Models from 'database/models';
import setLanguage from 'utils/international';


const { Accommodations, Rooms } = Models;

const validateAccommodationAndRoom = async (req, res, next) => {
  try {
    const {
      user: { preferedLang },
      body: {
        accommodationsID, roomNumber
      }
    } = req;

    const data = await Accommodations.findOne({
      where: {
        id: accommodationsID
      },
      include: [{
        model: Rooms,
      }],
    });
    if (data) {
      const roomData = data.Rooms;
      roomData.forEach((arrayItem) => {
        if (arrayItem.roomNumber === roomNumber) {
          return res.status(422).json({
            status: 422,
            error: setLanguage(preferedLang).__('roomAlreadyRegistered')
          });
        }
      });
      return next();
    }
    return res.status(404).json({
      status: 404,
      error: setLanguage(preferedLang).__('accommodationNotFound')
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      errors: {
        error: error.message
      }
    });
  }
};


export default validateAccommodationAndRoom;
