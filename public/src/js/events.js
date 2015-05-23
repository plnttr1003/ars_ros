$(document).ready(function() {
	var skip = 12;
	var context = {
		type: $('.content_title').attr('class').split(' ')[1],
		categorys: [],
		subsidiarys: []
	};

	var $container = $('.content_outer_block');
	var $column_main = $('.column_main_inner');

	$container.imagesLoaded(function() {
		$container.masonry({
			columnWidth: 60,
			gutter: 20
		});
	});

	var scrollLoad = function() {

		var outer_offset_bottom = $container.offset().top + $container.height();
		var column_height = $column_main.height();

		if (outer_offset_bottom - column_height <= $column_main.scrollTop()) {
			$column_main.off('scroll.load');

			$.ajax({ url: '/events', method: 'POST', async: false, data: {context: context, skip: skip, limit: 6} }).done(function(elems) {

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
		var context_item = $(this).closest('.content_navigate_block').attr('class').split(' ')[1];
		var nav_item = $(this).attr('class').split(' ')[1];

		if (context[context_item].indexOf(nav_item) !== -1) context[context_item].splice(context[context_item].indexOf(nav_item), 1);
		else context[context_item].push(nav_item);

		var current_elems = document.getElementsByClassName('event');

		$.ajax({url: '/events', method: 'POST', data: {context: context, skip: 0, limit: 6}, async: false }).done(function(elems) {
			if (elems != 'out') {
				$elems = $(elems);
				$container.masonry('remove', current_elems).append($elems).masonry('appended', $elems).imagesLoaded(function() {
					$container.masonry('layout');
				});
			}
		});
	});



});