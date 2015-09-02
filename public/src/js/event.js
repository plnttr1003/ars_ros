$(document).ready(function() {
	var context = {
		skip: 12,
		type: $('.content_title').attr('class').split(' ')[1],
		categorys: [],
		subsidiarys: []
	};

	var $container = $('.content_outer_block');
	var $column_main = $('.column_main_inner');

	$container.imagesLoaded(function() {
		$container.masonry({
			columnWidth: 60,
			gutter: 20,
			itemSelector: '.item_fancy'
		});
	})
});