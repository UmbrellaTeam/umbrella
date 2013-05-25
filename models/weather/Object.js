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
function Object(options) {

    this.temperatureMin = options.temperatureMin;
    this.temperatureMax = options.temperatureMax;
    this.humidity = options.humidity;
    this.cloudiness = options.cloudyness;
}

/**
 * Save or update suggestion
 *
 * @param object
 * @param callback
 */
Object.get = function(storage, options, callback) {

    return Object.getService(storage).get(
        options,
        callback
    );
};

Object.getService = function(storage) {
    if (!Service.service) {
        Service.service = new Service(storage);
    }

    return Service.service;
};