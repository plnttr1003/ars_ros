$(document).ready(function() {
	$('.item_fancy').fancybox({
		padding: 0,
		openEffect : 'none',
		closeEffect : 'none',
		closeClick : true
	});

function intro_runction() {
	var scr = $('body').height();
	$('.intro_block').animate({
			marginTop: - parseInt(scr),
	}, 800)
	setTimeout(function() { $('.intro_block').remove()}, 1000)
}

	$('.screen_block.intro_block').on('scroll', function(event) {
		intro_runction()
	});

	$('.screen_block.intro_block').click(function () {
		intro_runction()
	});


	$('.option.menu_option').click(function () {
			var scr = $('body').height();
			/*$('.info_block').show().css({'margin-top': - parseInt(scr) }).animate({
				marginTop: 0,
			}, 800);*/
			$('.info_block').show()
			$('.about_block').hide();
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
			$('.info_block').hide();
			$('.header_block').addClass('black_header');
	});

	$('.goto_down_inner.about').click(function () {
			var scr = $('body').height();
			$('.about_block').show(100);
			setTimeout(function() { $('.about_block').hide()}, 0);
			$('.header_block').removeClass('black_header');
		});


})