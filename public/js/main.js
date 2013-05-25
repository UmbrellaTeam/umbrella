$(function() {
    $('#ask').click(function() {
        $('.question-wrapper').css('margin-top', '3%');
        $('#ask').hide();
        $('#retry').show();
        $('.answer').fadeIn(300, function() {
        });
    });

    $('#retry').click(function() {
        $('#ask').show();
        $('#retry').hide();
        $('.answer').hide();
        $('.question-wrapper').css('margin-top', '18%');
    });
});