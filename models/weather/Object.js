/**
 * Weather object
 *
 * @author appr
 */

var Service = require('./Service');

/**
 * Constructor
 *
 * @param storage
 */
function Weather(options) {

    this.temperatureMin = options.temperatureMin;
    this.temperatureMax = options.temperatureMax;
    this.humidity = options.humidity;
    this.cloudiness = options.cloudiness;
}

/**
 * Save or update suggestion
 *
 * @param object
 * @param callback
 */
Weather.get = function(storage, options, callback) {

    return Weather.getService(storage).get(
        options,
        callback
    );
};

Weather.getService = function(storage) {
    if (!Service.service) {
        Service.service = new Service(storage);
    }

    return Service.service;
};

module.exports = Weather;