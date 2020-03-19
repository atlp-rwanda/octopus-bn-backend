 /**
   * @description a method to remove returnDate, stops keys in trip request and sets them to nulls
   * @param {object} payload
   * @returns {object} good to go payload for one way request
   */

  export const oneWayTripGenerator = (payload) => {
    const { returnDate, stops, ...oneWayTrip } = payload;
    return { ...oneWayTrip, returnDate: null, stops: null };
  };
  /**
     * @description a method to remove stops keys in trip request and sets them to nulls
     * @param {object} payload
     * @returns {object} good to go payload for return trip request
     */
  
  export const returnTripGenerator = (payload) => {
    const { stops, ...returnTrip } = payload;
    return { ...returnTrip, stops: null };
  };
  /**
     * @description a method to remove returnDate key in trip request and sets them to nulls
     * @param {object} payload
     * @returns {object} good to go payload for multi city request
     */
  
  export const multiCityTripGenerator = (payload) => {
    const { returnDate, ...multiCityTrip } = payload;
    return { ...multiCityTrip, returnDate: null };
  };
