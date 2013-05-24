$(function() {
    $('#ask').click(function() {
        $('.question-wrapper').animate(
            {'margin-top': '3%'}, 1000, function() {
            }
        );
    });
    /*$('#ask').click(function() {
        $('.question').hide();
        $('.question-asked').show();
    });
    $('#retry').click(function() {
        $('.question-asked').hide();
        $('.question').show();
    });*/
});