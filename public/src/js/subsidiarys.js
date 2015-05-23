$(document).ready(function() {
	$('.content_map_item')
		.on('mouseenter', function() {
			$('.content_item').eq($(this).parents('a').index()).addClass('current');
		})
		.on('mouseleave', function() {
			$('.content_item').removeClass('current');
		});

	$('.content_item')
		.on('mouseenter', function() {
			$('.content_map_block a').eq($(this).index('.content_item')).find('.content_map_item').addClass('current');
		})
		.on('mouseleave', function() {
			$('.content_map_item').removeClass('current');
		});
});