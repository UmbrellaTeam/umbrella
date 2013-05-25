/**
 * Weather service
 *
 * @author appr
 */

/**
 * Constructor
 *
 * @param storage
 */
function Service(storage) {

    this.storage = storage;
}

/**
 * Save or update suggestion
 *
 * @param object
 * @param callback
 */
Service.prototype.get = function(options, callback) {
    var Weather = require('./Object');
    var Constants = require('./Constants');

    return callback(null, {
        '2013-05-25 Morning': new Weather({
            temperatureMin: 11,
            temperatureMax: 16,
            humidity: 80,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-25 Noon': new Weather({
            temperatureMin: 15,
            temperatureMax: 18,
            humidity: 77,
            cloudiness: Constants.CLOUDINESS_RAINY
        }),
        '2013-05-25 Evening': new Weather({
            temperatureMin: 15,
            temperatureMax: 16,
            humidity: 73,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-25 Night': new Weather({
            temperatureMin: 13,
            temperatureMax: 15,
            humidity: 74,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-26 Morning': new Weather({
            temperatureMin: 13,
            temperatureMax: 15,
            humidity: 74,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-26 Noon': new Weather({
            temperatureMin: 17,
            temperatureMax: 19,
            humidity: 59,
            cloudiness: Constants.CLOUDINESS_RAINY
        }),
        '2013-05-26 Evening': new Weather({
            temperatureMin: 17,
            temperatureMax: 19,
            humidity: 55,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-26 Night': new Weather({
            temperatureMin: 16,
            temperatureMax: 17,
            humidity: 59,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-27 Morning': new Weather({
            temperatureMin: 15,
            temperatureMax: 17,
            humidity: 59,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-27 Noon': new Weather({
            temperatureMin: 17,
            temperatureMax: 20,
            humidity: 51,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-27 Evening': new Weather({
            temperatureMin: 17,
            temperatureMax: 20,
            humidity: 59,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        }),
        '2013-05-27 Night': new Weather({
            temperatureMin: 15,
            temperatureMax: 17,
            humidity: 65,
            cloudiness: Constants.CLOUDINESS_CLOUDY
        })
    });

};

module.exports = Service;