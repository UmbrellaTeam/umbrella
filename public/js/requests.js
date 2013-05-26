$(function() {
	var BACKEND = 'http://pogodable.ru/api';
    var firstLoad = true;

    var loadAnswer = function() {
        $('.answer-wrapper').hide();
        $.post(
            BACKEND + '/suggestions/find',
            {
                'activity': $('.question .activity li.active').attr('data-id'),
                'date': $('.question .date li.active').attr('data-id'),
                'timeOfDay': 'morning'
            },
            function(response) {
                if(response && response.suggestion) {
                    var timesOfDay = {
                        'morning': 'утром',
                        'day': 'днём',
                        'evening': 'вечером'
                    };
                    $('.answer-wrapper').fadeIn(300);
                    if (response.suggestion.author) {
                        response.suggestion.suggestion =
                        '&laquo;' + response.suggestion.suggestion + '&raquo;';
                        $('.answer div.author').html(
                            '<a target="_blank" href="http://twitter.com/' +
                                response.suggestion.author +
                                '">@' + response.suggestion.author +
                            '</a>');
                    } else {
                        $('.answer div.author').html('');
                    }
                    $('.answer div.suggestion').html(response.suggestion.suggestion);
                    if (response.weather) {
                        $('.answer .weather-list').empty();
                        var weather = {
                            'morning': response.weather['morning'],
                            'day': response.weather['day'],
                            'evening': response.weather['evening']
                        };
                        for (var i in weather) {
                            var currentWeather = response.weather[i];
                            var timeOfDay = timesOfDay[i];
                            $('.answer .weather-list').append($(
                                '<div class="weather">' +
                                    '<img src="/img/cloudiness/' + currentWeather.cloudiness + '.png"></img>' +
                                    '<span class="time">' +
                                        timeOfDay +
                                    '</span>' +
                                    '<span class="degrees">+' +
                                        currentWeather.temperatureMin +
                                        '…+' +
                                        currentWeather.temperatureMax +
                                    '</span>' +
                                '</div>'
                            ));
                        }
                    }
                    /*if (!firstLoad) {
                        changeBg();
                    }
                    firstLoad = false;*/
                }
            }
        );
    };

	$('#ask').click(loadAnswer);

    var selectElement = function(id) {
        var element = $('.question li[data-id="' + id + '"]');
        if (element.hasClass('active')) {
            return;
        }

        var otherElement = element.prev();
        otherElement.insertAfter(element).removeClass('active');
        element.addClass('active');
        loadAnswer();
    };

    $('.question li a').on('click', function() {
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        selectElement(id);

        return false;
    });

    var changeBg = function() {
        var oldBg = $('body').attr('class').split('-')[1];
        var newBg = oldBg;

        while (oldBg == newBg) {
            newBg = Math.floor(Math.random() * 4 + 0.9999999999);
        }

        $('body').attr('class', '');
        $('body').addClass('bg-' + newBg);
    };

    loadAnswer();
});