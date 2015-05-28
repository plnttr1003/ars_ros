$(document).ready(function() {
	$('.item_fancy').fancybox({
		padding: 0,
		openEffect : 'none',
		closeEffect : 'none',
		closeClick : true
	});

	$('.goto_down_inner.intro').click(function () {
			var scr = $('body').height();
			$('.intro_block').animate({
				marginTop: - parseInt(scr),
			}, 800)
			setTimeout(function() { $('.intro_block').remove()}, 1000)
		});

	$('.option.menu_option').click(function () {
			var scr = $('body').height();
			$('.info_block').show().css({'margin-top': - parseInt(scr) }).animate({
				marginTop: 0,
			}, 800)
	});

	$('.goto_down_inner.info').click(function () {
			var scr = $('body').height();
			$('.info_block').animate({
				marginTop: - parseInt(scr),
			}, 800)
			setTimeout(function() { $('.info_block').hide()}, 1000)
		});

})