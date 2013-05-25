/**
 * Weather service
 *
 * @author appr
 */

var Error = require('error');
var Constants = require('./Constants');
var jsdom = require('jsdom');
var fs = require('fs');
var jquery = fs.readFileSync("./public/js/jquery.js").toString();
var datejs = fs.readFileSync("./public/js/date.js").toString();

/**
 * Constructor
 *
 * @param storage
 */
function Service(storage) {

    this.storage = storage;
}

Service.DEFAULT_LOCATION = 'saint-petersburg';
Service.WEATHER_SOURCE = 'http://pogoda.yandex.ru/%location%/details';
Service.FORECAST_TTL = 3600;

/**
 * Save or update suggestion
 *
 * @param object
 * @param callback
 */
Service.prototype.get = function(options, callback) {

    var self = this;
    var location = options.location || Service.DEFAULT_LOCATION;
    var Weather = require('./Object');
    var date = options.date;

    this.storage.HGETALL('forecast:' + location + ':' + date, function(err, result) {
        if (err) {

            return new Error(
                'Failed to get forecast: ' + (err.message || 'Unknown error'),
                err,
                Error.CODE_SERVER_ERROR
            );
        }

        var getForecast = function(info) {

            if (info[date] && info[date][options.timeOfDay]) {

                return callback(null, info[date][options.timeOfDay]);
            }

            return callback(null, null);
        };

        if (!result) {

            return self.getAndSaveForecast(location, function(err, result) {
                if (err) {

                    return callback(err);
                }

                getForecast(result);
            });
        }

        var map = {};

        Object.keys(result).forEach(function(it) {
            map[it] = new Weather(JSON.parse(result[it]));
        });

        var r = {};
        r[date] = map;

        return getForecast(r);
    });
};

Service.prototype.getAndSaveForecast = function(location, callback) {
    var url = Service.WEATHER_SOURCE.replace('%location%', location);
    var self = this;
    var Weather = require('./Object');

    jsdom.env({
        html: url,
        src: [
            jquery, datejs
        ],
        done: function(errors, window) {

            if (errors && errors.length) {

                return callback(new Error(
                    'Failed to get weather',
                    {error: errors},
                    Error.CODE_SERVER_ERROR
                ));
            }

            var $ = window.$,
                result = {},
                timeOfDayEnum = ['morning', 'day', 'evening', 'night'],
                cloudinessMap = {
                    'облачно': Constants.CLOUDINESS_CLOUDY,
                    'малооблачно': Constants.CLOUDINESS_CLOUDY,
                    'переменная облачность': Constants.CLOUDINESS_CLOUDY,
                    'облачно, временами дождь': Constants.CLOUDINESS_RAINY,
                    'облачно, небольшой дождь': Constants.CLOUDINESS_RAINY,
                    'облачно, дождь, гроза': Constants.CLOUDINESS_RAINY,
                    'облачно с прояснениями, небольшой дождь': Constants.CLOUDINESS_RAINY,
                    'переменная облачность, возможен дождь, гроза': Constants.CLOUDINESS_RAINY,
                    'переменная облачность, небольшой дождь': Constants.CLOUDINESS_RAINY,
                    'ясно': Constants.CLOUDINESS_SUNNY
                },
                node = $('.b-forecast-detailed__line').first(),
                currentTime = new window.Date().getTime();

            for (var i = 0; i < 7; i++) {
                var dateObj = new window.Date(currentTime + i * 60 * 60 * 24 * 1000),
                    dateStr = dateObj.toString('yyyy-MM-dd'),
                    cloudinessColumn = 4;

                result[dateStr] = {};
                for (var j = 0; j < 4; j++) {
                    var timeOfDay = timeOfDayEnum[j],
                        weather = node.find('.b-forecast-detailed__temp').text(),
                        temperatureMin = parseInt(weather.split('…')[0], 10),
                        temperatureMax = parseInt(weather.split('…')[1], 10),
                        cloudiness = node.find('.b-forecast-detailed__item:eq(' + cloudinessColumn + ')').text();

                    cloudinessColumn = 2;

                    node = node.next();

                    result[dateStr][timeOfDay] = new Weather({
                        temperatureMin: temperatureMin,
                        temperatureMax: temperatureMax,
                        humidity: 0,
                        cloudiness: cloudinessMap[cloudiness]
                    });
                }

                node = node.next();
                cloudinessColumn = 4;
            }

            var dates = Object.keys(result);

            var saveDate = function(i) {

                if (i >= dates.length) {

                    return callback(null, result);
                }

                var date = dates[i];

                var forecastItem = {};

                Object.keys(result[date]).forEach(function(it) {
                    forecastItem[it] = JSON.stringify(result[date][it]);
                });

                self.storage.HMSET('forecast:' + location + ':' + date, forecastItem, function(err) {
                    if (err) {

                        return new Error(
                            'Failed to save forecast: ' + (err.message || 'Unknown error'),
                            err,
                            Error.CODE_SERVER_ERROR
                        );
                    }

                    self.storage.EXPIRE('forecast:' + location + ':' + date, Service.FORECAST_TTL, function(err) {
                        if (err) {

                            return new Error(
                                'Failed to save forecast: ' + (err.message || 'Unknown error'),
                                err,
                                Error.CODE_SERVER_ERROR
                            );
                        }

                        saveDate(i + 1);
                    });
                });
            };

            saveDate(0);
        }
    });
};

module.exports = Service;