$(function() {

    $('.style-options').addClass('active');
    setTimeout(function(){
        $('.style-options').removeClass('active');
    }, 5000);

    $('.style-options .toggle-btn').on('click', function() {
        $('.style-options').toggleClass('active');
    });

    $('.theme-style li a').on('click', function(e) {
        var style_link = $(this).attr('href');
        $('link.theme-st').attr('href', style_link);

        e.preventDefault();
    });
	
	$('.box-style li a').on('click', function(e) {
        var style_link = $(this).attr('href');
        $('link.box-st').attr('href', style_link);

        e.preventDefault();
    });
	
	$('.box-title li a').on('click', function(e) {
        var style_link = $(this).attr('href');
        $('link.box-tl').attr('href', style_link);

        e.preventDefault();
    });
	
	$('.style-color li a').on('click', function(e) {
        var style_link = $(this).attr('href');
        $('link.style-cl').attr('href', style_link);

        e.preventDefault();
    });

});