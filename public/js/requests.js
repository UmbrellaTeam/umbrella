$(function() {
	var BACKEND = 'http://pogodable.ru/api';

	$.get(BACKEND + '/activitys/', function(list) {
		for (var index in list) {
			var element = $('<option value="' +
				list[index]['_id'] + '">' +
				list[index]['activity'] +
				'</option>');

			$('.question .activity').append(element);
		}
		setDefaultSelect();
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
		for (var i = 0; i <= 6; i++) {
			var caption = null,
				dateObj = new Date(
					currentTime + i * 60 * 60 * 24 * 1000),
				dateStr = dateObj.toString('yyyy-MM-dd'),
				element = null;

			if(i === 0) {
				caption = 'сегодня';
			} else if(i === 1) {
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
		$.post(
			BACKEND + '/suggestions/find',
			{
				'activity': $('.question .activity').val(),
				'date': $('.question .day').val(),
				'timeOfDay': $('.question .timeOfDay').val()
			},
			function(response) {
				if(response && response.suggestion) {
					$('.question-wrapper .caption').addClass('topped');
					$('.answer-wrapper').fadeIn(300);
					$('.answer div').html(response.suggestion.suggestion);
					if(response.weather) {
						$('.answer img').attr('src', '/img/' + response.weather.cloudiness + '.png');
					}
				}
			}
		);
	});

	var setDefaultSelect = function() {
		var time = new Date();
		var day = time.getDay(),
			hours = time.getHours(),
			activity = "51a08e807aebff8865000003",
			timeOfDay = "evening";
		/* activity */
		if(day > 0 && day < 6) activity = "51a08e527aebff8865000002";
		$("select.activity").val(activity);
		/* timeOfDay */
		if(hours > 0 && hours < 11) timeOfDay = "morning";
		if(hours >= 11 && hours < 18) timeOfDay = "day";
		$("select.timeOfDay").val(timeOfDay);
	};
});