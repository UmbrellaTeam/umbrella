var jsdom = require('jsdom');
var fs = require('fs');
var jquery = fs.readFileSync("./public/js/jquery.js").toString();

jsdom.env({
    html: 'http://pogoda.yandex.ru/saint-petersburg/details',
    src: [
        jquery
    ],
    done: function(errors, window) {
        var $ = window.$;
        $('.b-forecast-detailed__temp').each(function() {
            console.log($(this).text());
        });
    }
});