var jsdom = require('jsdom');
var Weather = require('./models/weather/Object');
var Constants = require('./models/weather/Constants');
var fs = require('fs');
var jquery = fs.readFileSync("./public/js/jquery.js").toString();
var datejs = fs.readFileSync("./public/js/date.js").toString();

jsdom.env({
    html: 'http://pogoda.yandex.ru/saint-petersburg/details',
    src: [
        jquery, datejs
    ],
    done: function(errors, window) {
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

       console.log(result);
    }
});