$(document).ready(function() {
	var $container = $('.content_outer_block');
	var $column_main = $('.column_main_inner');
	var skip = 12;

	$container.masonry({
		columnWidth: 60,
		gutter: 20,
		itemSelector: '.news',
	});

	var scrollLoad = function() {

		var outer_offset_bottom = $container.offset().top + $container.height();
		var column_height = $column_main.height();

		if (outer_offset_bottom - column_height <= $column_main.scrollTop()) {
			$column_main.off('scroll.load');

			$.ajax({ url: '/news', method: 'POST', async: false, data: {skip: skip, limit: 6} }).done(function(elems) {

				if (elems != 'out') {
					$elems = $(elems);
					$container.append($elems).masonry('appended', $elems);
					skip+= 7;
					$column_main.on('scroll.load', scrollLoad);
				}
			});
		}
	};

	$column_main.on('scroll.load', scrollLoad);

});