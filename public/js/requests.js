$(function() {
	var BACKEND = 'http://pogodable.ru/api';

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
                    $('.answer-wrapper').fadeIn(300);
                    $('.answer div.suggestion').html(response.suggestion.suggestion);
                    if(response.weather) {
                        $('.answer .weather-list').empty();
                        for (var i in response.weather) {
                            if (i == 'night') {
                                continue;
                            }
                            var currentWeather = response.weather[i];
                            console.log(currentWeather);
                            $('.answer .weather-list').append($(
                                '<div class="weather">' +
                                    '<img src="/img/' + currentWeather.cloudiness + '.png"></img>' +
                                    '<span class="degrees">+' +
                                        currentWeather.temperatureMin +
                                        '…+' +
                                        currentWeather.temperatureMax +
                                    '</span>' +
                                '</div>'
                            ));
                        }
                    }
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
    };

    $('.question li a').on('click', function() {
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        selectElement(id);

        return false;
    });

	var setDefaultSelect = function() {
		var time = new Date();
		var day = time.getDay(),
			hours = time.getHours(),
			activity = "51a08e807aebff8865000003",
			timeOfDay = "evening";

		if(day > 0 && day < 6) {
            activity = "51a08e527aebff8865000002";
        }
		selectElement(activity);
	};

    loadAnswer();
});