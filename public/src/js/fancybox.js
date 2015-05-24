$(document).ready(function() {
	$('.item_fancy').fancybox({
		padding: 0,
		openEffect : 'none',
		closeEffect : 'none',
		closeClick : true
	});
	$('.goto_down_inner').click(function () {
			var scr = $('body').height();
			$('.intro_block').animate({
				marginTop: - parseInt(scr),
			}, 500 ).hide(600);
		});
})