$(function() {
    var BACKEND = 'http://pogodable.ru/api';

    $.get(BACKEND + '/activitys', function(list) {
        for (var index in list) {
            var element = $('<option value="' +
                list[index]['_id'] + '">' +
                list[index]['activity'] +
                '</option>');

            $('.question .activity').append(element);
        }
    });

    (function() {
        // generating dates
        var captions = {
            0: 'в воскресенье',
            1: 'в понедельник',
            2: 'во вторник',
            3: 'в среду',
            4: 'в четверг',
            5: 'в пятницу',
            6: 'в субботу'
        };

        var currentTime = new Date().getTime();
        for (var i = 0; i <= 2; i++) {
            var caption = null,
                dateObj = new Date(
                    currentTime + i * 60 * 60 * 24 * 1000),
                dateStr = dateObj.toString('yyyy-MM-dd'),
                element = null;

            if (i === 0) {
                caption = 'сегодня';
            } else if (i === 1) {
                caption = 'завтра';
            } else {
                caption = captions[dateObj.getDay()];
            }

            element = $('<option value="' +
                dateStr + '">' + caption +
                '</option>');

            $('.question .day').append(element);
        }

    })();

    $('#ask').click(function() {
        $('.answer-wrapper').hide();
        $.get(
            BACKEND + '/suggestions/find',
            {
                'activity': $('.question .activity').val(),
                'date': $('.question .day').val(),
                'timeOfDay': $('.question .timeOfDay').val()
            },
            function(response) {
                if (response && response['suggestion']) {
                    $('.question-wrapper .caption').addClass('topped');
                    $('.answer-wrapper').fadeIn(300);
                    $('.answer div').html(response['suggestion']);
                    $('.answer img').attr('src', '/img/' + response['cloudiness'] + '.png');
                }
            }
        );
    });
});