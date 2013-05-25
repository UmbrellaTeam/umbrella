$(function() {
    var BACKEND = 'http://pogodable.ru/api/';
    $.get(
        BACKEND + 'activitys',
        function(response) {
            console.log(response);
        }
    );
});