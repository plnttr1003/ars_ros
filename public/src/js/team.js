$(document).ready(function() {
	var $container = $('.content_outer_block');

	$container.imagesLoaded(function() {
		$container.masonry({
			columnWidth: 60,
			gutter: 20
		});
	});

	$('.column_main_inner').on('scroll', function(event) {
		$('.content_scroll_items').scrollTop($(this).scrollTop());
	});
});