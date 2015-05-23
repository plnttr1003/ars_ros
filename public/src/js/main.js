$(document).ready(function() {
	var context = [];
	var skip = 12;

	var $container = $('.content_outer_block');
	var $column_main = $('.column_main_inner');
	var news_stamp = document.getElementsByClassName('content_news_block')[0];

	$container.imagesLoaded(function() {
		$container.masonry({
			columnWidth: 30,
			gutter: 20,
			itemSelector: '.event',
			isInitLayout: false
		}).masonry('stamp', news_stamp).masonry('layout').css('opacity', 1);
	});

	var scrollLoad = function() {

		var outer_offset_bottom = $container.offset().top + $container.height();
		var column_height = $column_main.height();

		if (outer_offset_bottom - column_height <= $column_main.scrollTop()) {
			$column_main.off('scroll.load');

			$.ajax({ url: '/', method: 'POST', async: false, data: {context: context, skip: skip, limit: 6} }).done(function(elems) {

				if (elems != 'out') {
					$elems = $(elems);
					$container.append($elems).masonry('appended', $elems).imagesLoaded(function() {
						skip+= 7;
						$container.masonry('layout');
						$column_main.on('scroll.load', scrollLoad);
					});
				}
			});
		}
	};

	$column_main.on('scroll.load', scrollLoad);

	$('.navigate_item').on('click', function() {
		skip = 12;
		var type = $(this).attr('class').split(' ')[1];

		$column_main.on('scroll.load', scrollLoad);

		context.indexOf(type) !== -1
			? context.splice(context.indexOf(type), 1)
			: context.push(type);

		var current_elems = document.getElementsByClassName('event');

		$.ajax({url: '/', method: 'POST', data: {context: context, skip: 0, limit: 6}, async: false }).done(function(elems) {
			if (elems != 'out') {
				$elems = $(elems);
				$container.masonry('remove', current_elems).append($elems).masonry('appended', $elems).imagesLoaded(function() {
					$container.masonry('layout');
				});
			}
		});
	});
});