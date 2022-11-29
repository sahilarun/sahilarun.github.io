/* -----------------------------------------------
				Scripts
--------------------------------------------------

    Template Name: Trail - Personal Portfolio Template
    Author: Malyarchuk
    Copyright: 2020

--------------------------------------------------

Table of Content

	01. Preloader
	02. Isotope Portfolio
	03. Blogs Masonry
	04. Menu
	05. Testimonials
	06. Portfolio Link
	07. Box
	08. Map
	09. Validate Contact Form
	10. Ajax Portfolio

----------------------------------- */
$(window).on('load', function() {
	
	/* 01. Preloader */
	$(".preloader").delay(1000).fadeOut(1000);
	
	/* 02. Isotope Portfolio */
    if( $('.portfolio-items').length ) {
        var $elements = $(".portfolio-items"),
            $filters = $('.portfolio-filter ul li');
        $elements.isotope();

        $filters.on('click', function(){
            $filters.removeClass('active');
            $(this).addClass('active');
            var selector = $(this).data('filter');
            $(".portfolio-items").isotope({
                filter: selector,
                hiddenStyle: {
                    transform: 'scale(.2) skew(30deg)',
                    opacity: 0
                },
                visibleStyle: {
                    transform: 'scale(1) skew(0deg)',
                    opacity: 1,
                },
                transitionDuration: '.5s'
            });
        });
    }
	
	/* 03. Blogs Masonry */
    $('.blog-masonry').isotope({ layoutMode: 'moduloColumns' });
	
	/* 07. Box */
	new Accordion(['.service',
				   '.info',
				   '.skills',
				   '.testominals',
				   '.work-process',
				   '.form-block',
				   '.contact-block',
				   '.google-map',
				   '.blog-form', 
				   '.blog-comments'], {
      		showItem: true
	});
	
});

$(document).ready(function() {
  
	/* 04. Menu */
	var animating = false;
  
	function menuToggle() {
		$(".page, .menu").toggleClass("menu-active");
		$(".js-btn").toggleClass("m-btn");
		$(document).off("click", ".content", closeNotFocusedMenu);
	};
  
	function closeNotFocusedMenu(e) {
		if (!$(e.target).closest(".menu").length) {
			menuToggle();
		}
	};
  
	$(document).on("click", ".js-btn", function() {
		if (animating) return;
		menuToggle();
		$(document).on("click", ".content", closeNotFocusedMenu);
	});
  
	$(document).on("click", ".menu-item:not(.js-btn)", function() {
		animating  = true;
		var $this = $(this);
		var page = +$this.data("page");
		$(".js-btn").removeClass("js-btn");
		$(".page.active").removeClass("active");
		$this.addClass("js-btn m-btn");
		$(".page-"+page).addClass("active");
		$(".page, .menu").removeClass("menu-active");
		$(document).off("click", ".content", closeNotFocusedMenu);
		setTimeout(function() {
			$(".menu")[0].className = $(".menu")[0].className.replace(/\bpage-active-.*\b/gi, "");
			$(".menu").addClass("page-active-"+page);
			animating = false;
		}, 1000);
	});
	
	/* 05. Testimonials */
	var swiper = new Swiper('.testimonials-content', {
		spaceBetween: 30,
		effect: 'fade',
		loop: false,
		navigation: {
			nextEl: '.next',
			prevEl: '.prev'
		},
		on: {
			init: function() {
				var index = this.activeIndex;
				var target = $('.testimonial-item').eq(index).data('target');
				
				console.log(target);
				
				$('.img-item').removeClass('active');
				$('.img-item#'+ target).addClass('active');
			}
		}
	});

	swiper.on('slideChange', function () {
		var index = this.activeIndex;
		var target = $('.testimonial-item').eq(index).data('target');

		console.log(target);

		$('.img-item').removeClass('active');
		$('.img-item#'+ target).addClass('active');

		if(swiper.isEnd) {
			$('.prev').removeClass('disabled');
			$('.next').addClass('disabled');
		} else {
			$('.next').removeClass('disabled');
		}
		
		if(swiper.isBeginning) {
			$('.prev').addClass('disabled');
		} else {
			$('.prev').removeClass('disabled');
		}
	});

	// Favorite
	$(".js-fav").on("click", function() {
		$(this).find('.heart').toggleClass("is-active");
	});
	
	/* 06. Portfolio Link */
	$(".portfolio-items .image-link").magnificPopup({
		type: "image"
	});
	
	$(".portfolio-items .video-link").magnificPopup({
		type: "iframe"
	});

	ajaxPortfolioSetup(
		$('.portfolio-items .ajax-link'), 
		$('.ajax-portfolio')
	);
	
	/* 08. Map */
	if (jQuery("#map").length > 0) {
		var latlog = jQuery('#map').data('latlog'),
			popupTextit = jQuery('#map').data('popuptext'),
			map = L.map('map').setView(latlog, 15);
		L.tileLayer(jQuery('#map').data('map-back'), {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            format: 'png'
        }).addTo(map);
        var greenIcon = L.icon({
            iconUrl: jQuery('#map').data('popupicon'),
            iconSize: [40, 40],
            popupAnchor: [0, -26]
        });
        L.marker(latlog, {
            icon: greenIcon
        }).addTo(map).bindPopup(popupTextit).openPopup();
	}
	
	/* 09. Validate Contact Form */
	if ($("#contact-form").length) {
        $("#contact-form").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },

                email: "required",
				
            },

            messages: {
                name: "Please enter your name",
                email: "Please enter your email address"
            },

            submitHandler: function (form) {
                $.ajax({
                    type: "POST",
                    url: "/mail.php",
                    data: $(form).serialize(),
                    success: function () {
                        $( "#loader").hide();
                        $( "#success").slideDown( "slow" );
                        setTimeout(function() {
                        $( "#success").slideUp( "slow" );
                        }, 3000);
                        form.reset();
                    },
                    error: function() {
                        $( "#loader").hide();
                        $( "#error").slideDown( "slow" );
                        setTimeout(function() {
                        $( "#error").slideUp( "slow" );
                        }, 3000);
                    }
                });
                return false;
            }

        });
    }
	
});

/* 10. Ajax Portfolio */
function ajaxPortfolioSetup($ajaxLink, $ajaxContainer) {
    $ajaxLink.on('click', function(e) {
        var link = $(this).attr('href');

        if(link === "#") {
            e.preventDefault();
            return;
        }

        $ajaxContainer.find('.content-wrap .popup-content').empty();

        $ajaxContainer.addClass('on');
        $.ajax({
            cache: false,
            headers: {"cache-control": "no-cache"},
            url: link,
            beforeSend: function() {
                $ajaxContainer.find('.ajax-loader').show();
            },
            success: function(result) {
                $ajaxContainer.find('.content-wrap .popup-content').html(result);
            },
            complete: function() {
                $ajaxContainer.find('.ajax-loader').hide();
            },
            error: function(e) {
                $ajaxContainer.find('.ajax-loader').hide();
                $ajaxContainer.find('.content-wrap .popup-content').html('<h1 class="text-center">Something went wrong! Retry or refresh the page.</h1>')
            }
        });
        e.preventDefault();
    });

    $ajaxContainer.find('.popup-close').on('click', function() {
        $ajaxContainer.removeClass('on');
    });
}