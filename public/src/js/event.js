$(document).ready(function() {
	$('.content_scroll_items').masonry({
	  columnWidth: 362,
	  "gutter": 10,
	  itemSelector: '.item_fancy'
	});

function intro_runction() {
	var scr = $('body').height();
	$('.intro_block').animate({
			opacity: 0,
	}, 500)
	setTimeout(function() { $('.intro_block').remove()}, 600)
}

	$('.screen_block.intro_block').on('scroll', function(event) {
		intro_runction()
	});

	$('.screen_block.intro_block').click(function () {
		intro_runction()
	});


	$('.option.menu_option').click(function () {
			var scr = $('body').height();
			$('.info_block').show()
			$('.about_block, .contacts_block').hide();
			$('.header_block').addClass('black_header');
	});

	$('.goto_down_inner.info').click(function () {
			var scr = $('body').height();
			$('.info_block').show(100);
			setTimeout(function() { $('.info_block').hide()}, 0);
			$('.header_block').removeClass('black_header');
		});



		$('.menu_item.about').click(function () {
			var scr = $('body').height();
			/*$('.about_block').show().css({'margin-top': - parseInt(scr) }).animate({
				marginTop: 0,
			}, 800);
			*/
			$('.about_block').show();
			$('.info_block, .contacts_block').hide();
			$('.header_block').addClass('black_header');
	});

		$('.menu_item.contacts').click(function () {
			var scr = $('body').height();
			/*$('.about_block').show().css({'margin-top': - parseInt(scr) }).animate({
				marginTop: 0,
			}, 800);
			*/
			$('.contacts_block').show();
			$('.info_block, .about_block').hide();
			$('.header_block').addClass('black_header');
	});

	$('.goto_down_inner.about').click(function () {
			var scr = $('body').height();
			$('.about_block').show(100);
			setTimeout(function() { $('.about_block, .contacts_block').hide()}, 100);
			$('.header_block').removeClass('black_header');
		});

});